import * as bcrypt from "bcryptjs";

async function run() {
  const plainPassword = "123456";
  const saltRounds = 12;

  const hash = await bcrypt.hash(plainPassword, saltRounds);

  console.log("Plain:", plainPassword);
  console.log("Hashed:", hash);
}

run().catch(console.error);
