import jwt from "jsonwebtoken";

export const onlyadmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(403)
        .json({ sucess: false, message: "Unathorized access" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodeToken.role === "admin") {
      req.user = decodeToken;
      next();
    } else {
      return res
        .status(403)
        .json({ sucess: false, message: "Unathorized access not admin" });
    }
  } catch (error) {
    console.log("Error in authenticate middleware", error);
    res.status(500).json({ message: "Intrenal server error " });
  }
};
