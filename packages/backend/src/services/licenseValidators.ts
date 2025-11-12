import axios from "axios";

export async function validateCA(licenseNo: string) {
  try {
    const response = await axios.post(
      "https://api.decentro.tech/verify/ca",
      { membership_number: licenseNo },
      { headers: { Authorization: `Bearer ${process.env.DECENTRO_API_KEY}` } }
    );

    if (response.data?.verified) {
      return { valid: true, data: response.data.details };
    }
    return { valid: false, message: "Invalid CA membership number" };
  } catch (error) {
    console.error("CA verification error:", error);
    return { valid: false, message: "CA license verification API error" };
  }
}

export async function validateCS(licenseNo: string) {
  try {
    const response = await axios.post(
      "https://api.surepass.io/api/v1/icsi/verify",
      { membership_number: licenseNo },
      { headers: { Authorization: `Bearer ${process.env.SUREPASS_API_KEY}` } }
    );

    if (response.data?.success) {
      return { valid: true, data: response.data.data };
    }
    return { valid: false, message: "Invalid CS membership number" };
  } catch (error) {
    console.error("CS verification error:", error);
    return { valid: false, message: "CS verification API failed" };
  }
}

export async function validateAdvocate(licenseNo: string) {
  try {
    const response = await axios.post(
      "https://api.legalinfo.in/verify/advocate",
      { enrollment_no: licenseNo },
      { headers: { Authorization: `Bearer ${process.env.LEGALINFO_API_KEY}` } }
    );

    if (response.data?.status === "verified") {
      return { valid: true, data: response.data.details };
    }
    return { valid: false, message: "Invalid advocate license number" };
  } catch (error) {
    console.error("Advocate verification error:", error);
    return { valid: false, message: "Advocate license verification failed" };
  }
}

export async function validateTaxConsultant(licenseNo: string) {
  try {
    const response = await axios.get(
      `https://api.mastergst.com/public/search/gstin/${licenseNo}`,
      {
        headers: {
          client_id: process.env.MASTERGST_CLIENT_ID!,
          client_secret: process.env.MASTERGST_SECRET!,
        },
      }
    );

    if (response.data?.status === "Active") {
      return { valid: true, data: response.data };
    }
    return { valid: false, message: "Invalid GST or inactive tax consultant" };
  } catch (error) {
    console.error("Tax consultant verification error:", error);
    return { valid: false, message: "Tax consultant verification API error" };
  }
}
