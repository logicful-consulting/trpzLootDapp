import React from "react";
import "../styles/modal.css";
import { GOOGLE_FORM_URL } from "./ClaimBoxes";

const Modal = (params) => {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="modalCloseButton">
          <button onClick={params.closeModal}>X</button>
        </div>
        <div className="modalTitle">
          {!params.claimingLoot ? (
            <h1>{params.minted ? "Claim your rewards" : "Minting your NFT"}</h1>
          ) : (
            <h1>
              {params.claimedLoot?.id
                ? "Claimed your loot!!"
                : "Claiming your loot..."}
            </h1>
          )}
        </div>
        <div className="modalBody">
          {!params.claimingLoot ? (
            <p>
              {params.minted
                ? "Your NFT has been minted, hit claim to get your rewards."
                : "Waiting for NFT to be minted! Please wait a second while we wait for confirmation."}
            </p>
          ) : (
            <p>
              {params.claimedLoot?.id ? (
                <>
                  <p className="modalContainer__text">
                    Your loot was successfully claimed! You have won{" "}
                    {params.claimedLoot.prize_name}.
                  </p>
                  {!!params.claimedLoot.irl ? (
                    <p>
                      Fill in{" "}
                      <a
                        className="modalContainer__link"
                        href={GOOGLE_FORM_URL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        this form
                      </a>{" "}
                      to ensure you receive your loot. Your unique loot ID is{" "}
                      <strong>{params.claimedLoot.id}</strong>.
                    </p>
                  ) : (
                    <p>Please allow 72 hours to receive your loot.</p>
                  )}
                </>
              ) : (
                "Your loot rewards are being claimed. Please wait a second while we wait for confirmation."
              )}
            </p>
          )}
        </div>
        {params.minted && !params.claimingLoot && (
          <div className="modalFooter">
            <button
              className="button"
              onClick={async () => {
                const loot = await params.claimLoot(
                  params.claimingBox,
                  params.mintedTokenId,
                  params.walletAddress
                );
                params.setClaimedLoot(loot);
              }}
            >
              Claim Rewards
            </button>
          </div>
        )}
        {params.claimingLoot && params.claimedLoot?.id && (
          <div className="modalFooter">
            <button
              className="button"
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
