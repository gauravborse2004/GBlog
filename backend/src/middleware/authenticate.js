import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Unathorized access" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    next();
  } catch (error) {
    console.log("Error in authenticate middleware", error);
    res.status(500).json({ message: "Intrenal server error " });
  }
};
