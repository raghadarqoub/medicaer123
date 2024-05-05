import express  from "express";
import {updateUser ,
        deleteUser,
        getSingleUser,
        getAllUser,
        getUserProfile,
        getMyAppointments,
     
    } from "../Controllers/userController.js";
import {authenticate , restrict }from "../auth/verifyToken.js";

const router = express.Router();
router.get("/:id",authenticate, restrict(["patient"]),getSingleUser);
router.get("/", authenticate, getAllUser);
router.put("/:id",updateUser,authenticate, restrict(["patient"]));
router.delete("/:id",authenticate, restrict(["patient"]),deleteUser);
router.get("/profile/me",authenticate, restrict(["patient"]),getUserProfile);
router.get("/appointments/my-appointments",authenticate, restrict(["patient"]),getMyAppointments);


export default router;