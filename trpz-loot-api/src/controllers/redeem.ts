import { Request, Response } from "express";

import { boxTypeToContract } from "../contracts";
import { boxTypes, BoxType } from "../types";
import { supabaseClient } from "../supabase";

const post = async (req: Request, res: Response) => {
  const { boxType, address, tokenId } = req.body;

  if (!boxType || !address || !tokenId) {
    return res.status(400).send("Missing parameters");
  }

  if (!boxTypes.includes(boxType)) {
    return res.status(400).send("Invalid box type");
  }

  const safeBoxType = boxType as BoxType;
  const contract = boxTypeToContract[safeBoxType];
  try {
    const expectedAddress = await contract.ownerOf(tokenId);
    if (!expectedAddress) {
      return res.status(400).send("Token has no owner");
    }

    if (
      expectedAddress &&
      address.toLowerCase() !== expectedAddress.toLowerCase()
    ) {
      return res.status(400).send("Invalid address for token id");
    }

    const { data } = await supabaseClient
      .from("prizes")
      .update({ mint_address: address })
      .match({ tier: boxType, token_id: tokenId })
      .single();

    return res.status(200).send(data);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Failed to authenticate token owner");
  }
};

const get = async (req: Request, res: Response) => {
  const { boxType, address, tokenId } = req.query;
  console.log(req.url);

  if (!boxType || !address || !tokenId) {
    return res.status(400).send("Missing parameters");
  }

  if (!boxTypes.includes(boxType as any)) {
    return res.status(400).send("Invalid box type");
  }

  const { data } = await supabaseClient
    .from("prizes")
    .select()
    .match({ tier: boxType, mint_address: address, token_id: tokenId })
    .single();

  return res.status(200).send(data || {});
};

export const redeemController = {
  post,
  get,
};
