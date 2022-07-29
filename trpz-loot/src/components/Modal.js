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
          <h1>{params.minted ? "Claim your rewards" : "Minting your NFT"}</h1>
        </div>
        <div className="modalBody">
          <p>
            {params.minted
              ? "Your NFT has been minted, hit claim to instantly get your rewards."
              : "Waiting for NFT to be minted! Please wait a second while we wait for confirmation."}
          </p>
        </div>
          {params.minted && <div className="modalFooter">
            <button className="button"
            onClick={() => {
              const NFTId = params.getRecentNFT(params.claimingBox)
              params.claimLoot(params.claimingBox, NFTId)
            }}
            >Claim Rewards</button>
          </div>
          }
      </div>
    </div>
  );
};

export default Modal;
