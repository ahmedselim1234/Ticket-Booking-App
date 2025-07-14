const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../util/sendEmail");
const { read } = require("fs");

exports.signup = async (req, res, next) => {
  const { first_name, email, password } = req.body;
  if (!first_name || !email || !password)
    return res.json({ m: "fill all fields" });

  try {
    const user = await User.findOne({ email: email });
    if (user) return res.json({ m: "this email is already exist" });

    const hashedPass = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      first_name,
      email,
      password: hashedPass,
    });

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: createUser._id,
          role: createUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    const refreshToken = jwt.sign(
      {
        userInfo: {
          id: createUser._id,
          role: createUser.role,
        },
      },
      process.env.REFREESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ accessToken, email, password });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ m: "fill all fields" });

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ m: "this email is not  exist" });

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) return res.json({ m: "enter a valid password " });

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.REFREESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ accessToken, email, password });
  } catch (err) {
    console.log(err);
  }
};

exports.refresh = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) return res.json({ m: "un auth" });

  jwt.verify(token, process.env.REFREESH_TOKEN_SECRET, async (err, decode) => {
    if (err) return res.json({ m: "forbidden" });

    const user = await User.findById(decode.userInfo.id);
    console.log(user);

    if (!user) return res.status(401).json({ message: "unAuth" });

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    res.json({ accessToken });
  });
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt", {
    HttpOnly: true,
    sameSite: "none",
  });
  res.json({ message: "logged out" });
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ m: "this email is not exist" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    user.passwordResetCode = hashedCode;
    user.expireResetCode = Date.now() + 60 * 10 * 1000;
    user.verifyResetCode = false;

    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "your reset code ",
        message: `hi ${user.first_name} \n your reset code is \n ${resetCode} `,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.expireResetCode = undefined;
      user.verifyResetCode = undefined;
      await user.save();
      res.json({ m: "error when sending email" });
    }

    res.json({ m: "d" });
  } catch (err) {
    console.log(err);
  }
};

exports.verifyResetCode = async (req, res, next) => {
  const { enteredCode } = req.body;

  try {
    const hashedCode = await crypto
      .createHash("sha256")
      .update(enteredCode)
      .digest("hex");
    const user = await User.findOne({
      passwordResetCode: hashedCode,
      expireResetCode: { $gt: Date.now() },
    });
    if (!user) return res.json({ m: "code invalid or expired" });
    user.verifyResetCode = true;
    console.log(user);

    await user.save();
    return res.json({ m: "success" });
  } catch (err) {
    console.log(err);
  }
};

exports.addNewPassword = async (req, res, next) => {
  const { email,password } = req.body;
  try {
    const user = await User.findOne({ email: email }); 
    if(user.verifyResetCode===false) return res.status(400).json({ m: "enter the reset code " });
    if (!user) return res.json({ m: "enter valid email" });
    const hashedPass= await bcrypt.hash(password,10);
    user.password=hashedPass;
     user.passwordResetCode = undefined;
      user.expireResetCode = undefined;
      user.verifyResetCode = undefined;
    await user.save();


    
    res.json({m:"password changed successfully"})
  } catch (err) {
    console.log(err);
  }
};
