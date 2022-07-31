import React from "react";
import "../styles/modal.css";

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
          <h1>{params.claimedLoot ? "Claimed your loot!!" : "Claiming your loot..."}</h1>
        )}
        </div>
        <div className="modalBody">
          {!params.claimingLoot ? (
            <p>
              {params.minted
                ? "Your NFT has been minted, hit claim to instantly get your rewards."
                : "Waiting for NFT to be minted! Please wait a second while we wait for confirmation."}
            </p>
          )
          : (
            <p>
              {params.claimedLoot
                ? "Your loot was successfully claimed! You have won..."
                : "Your loot rewards are being claimed. Please wait a second while we wait for confirmation."}
            </p>
          )}
        </div>
        {params.minted && !params.claimingLoot && (
          <div className="modalFooter">
            <button
              className="button"
              onClick={() => {
                const NFTId = params.getRecentNFT(params.claimingBox);
                params.claimLoot(params.claimingBox, NFTId);
              }}
            >
              Claim Rewards
            </button>
          </div>
        )}
        {params.claimingLoot && params.claimedLoot && (
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
