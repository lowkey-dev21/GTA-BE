import express from "express"
import { createCountry, createPhoneNumber, createUsername, skipAllOnboard, skipOnboardOne, skipOnboardThree, skipOnboardTwo, uploadProfilePicture } from "../controllers/onboarding/onboarding.js"

const router = express.Router()

router.post("/username", createUsername)
router.post("/phone", createPhoneNumber)
router.post("/country", createCountry)
router.post("/profile-picture", uploadProfilePicture)
router.post("/skip-onboard-one", skipOnboardOne)
router.post("/skip-onboard-two", skipOnboardTwo)
router.post("/skip-onboard-three", skipOnboardThree)
router.post("/skip-all", skipAllOnboard)

export default router
