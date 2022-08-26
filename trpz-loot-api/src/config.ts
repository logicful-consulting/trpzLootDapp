if (process.env.ENVIRONMENT === "development") {
  require("dotenv").config();
}

const {
  PORT,
  ENVIRONMENT,
  RPC_URL,
  BRONZE_ADDRESS,
  SILVER_ADDRESS,
  GOLD_ADDRESS,
  SUPABASE_URL,
  SUPABASE_KEY,
  SUPABASE_SERVICE_ROLE,
} = process.env;

export const config = {
  port: PORT,
  environment: ENVIRONMENT,
  eth: {
    rpcUrl: RPC_URL,
    bronzeContractAddress: BRONZE_ADDRESS,
    silverContractAddress: SILVER_ADDRESS,
    goldContractAddress: GOLD_ADDRESS,
  },
  supabase: {
    url: SUPABASE_URL,
    key: SUPABASE_KEY,
    serviceRole: SUPABASE_SERVICE_ROLE,
  },
};

console.log("Application Config", config);
