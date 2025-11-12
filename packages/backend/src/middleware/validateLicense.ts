import { Router } from "express";
import { validateCA, validateCS, validateAdvocate, validateTaxConsultant } from "../services/licenseValidators";

const router = Router();

router.post("/", async (req, res) => {
  const { professionType, licenseNo } = req.body;

  if (!professionType || !licenseNo) {
    return res.status(400).json({
      success: false,
      message: "Profession type and license number are required",
    });
  }

  try {
    let result;

    switch (professionType) {
      case "CA":
        result = await validateCA(licenseNo);
        break;
      case "CS":
        result = await validateCS(licenseNo);
        break;
      case "Advocate":
        result = await validateAdvocate(licenseNo);
        break;
      case "TaxConsultant":
        result = await validateTaxConsultant(licenseNo);
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid profession type" });
    }

    if (result.valid) {
      return res.json({ success: true, data: result.data });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    console.error("License validation error:", err);
    return res.status(500).json({
      success: false,
      message: "License validation failed. Please try again later.",
    });
  }
});

export default router;
