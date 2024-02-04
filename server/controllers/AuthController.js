import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ msg: "Email is Required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.json({ msg: "User not Found", status: false });
    } else {
      return res.json({ msg: "User found", status: true, data: user });
    }
  } catch (err) {
    console.error("Error in checkUser:", err);
    next(err);
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body;

    if (!email || !name || !profilePicture) {
      return res.send("Email, Name and Image required");
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.create({
      data: { email, name, about, profilePicture },
    });
    return res.json({ msg: "Success", status: true, user });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });
    const usersGroupedByInitialLetter = {};

    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupedByInitialLetter[initialLetter]) {
        usersGroupedByInitialLetter[initialLetter] = [];
      }
      usersGroupedByInitialLetter[initialLetter].push(user);
    });
    return res.status(200).send({ users: usersGroupedByInitialLetter });
  } catch (err) {
    next(err);
  }
};export const generateToken = async (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    console.log('====================================');
    console.log(appId);
    console.log('====================================');
    const serverSecret =process.env.ZEGO_APP_SECRET;
    console.log('====================================');
    console.log(serverSecret+"serversecret");
    console.log('====================================');
    const userId = req.params.userId;

    console.log('====================================');
    console.log(userId+"userid");
    console.log('====================================');

    const effectiveTime = 3600;
    const payload = ""; // Check if this is intentional

    if (appId && serverSecret && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      );

      if (token) {
        console.log("Generated token:", token); // Log the generated token
        return res.status(200).json({ token });
      } else {
        return res.status(500).send("Token generation failed");
      }
    } else {
      return res.status(400).send("UserId, serverSecret, and appId are required");
    }
  } catch (error) {
    console.error("Token generation error:", error);
    return res.status(500).send("Internal server error");
  }
};
