const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    const refreshToken = jwt.sign(
      {
        userInfo: {
          id: createUser._id,
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
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
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
