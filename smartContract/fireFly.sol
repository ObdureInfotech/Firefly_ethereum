// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity ^0.5.6;

contract FireFly {
    struct ff {
        uint256 barCode;
        string hashData;
        uint256 txnNumber;
    }

    mapping(uint256 => ff)   ffMapping;

    function storeHashedFile(
        uint256 barCode,
        string memory hashData,
        uint256 txnNumber
    ) public {
        ffMapping[barCode] = ff(barCode, hashData, txnNumber);
    }
    function storeHashedFileMultiple(
        uint256 [] memory barCode,
        string[] memory hashData,
        uint256 [] memory txnNumber
    ) public {
        require(barCode.length == hashData.length && hashData.length== txnNumber.length,"Array length does not match required length");
        for(uint256 i =0;i<barCode.length;i++){
        ffMapping[barCode[i]] = ff(barCode[i], hashData[i], txnNumber[i]);   
        }
    }


    function getHashedTransactionNumber(uint256 barCode)
        public
        view
        returns (uint256)
    {
        require(
            ffMapping[barCode].barCode == barCode,
            "Barcode  doesnt exist!!"
        );
        ff memory retrievedStruct = ffMapping[barCode];
        return retrievedStruct.txnNumber;
    }

    function checkHashedValue(uint256 barCode, string memory hashedValue)
        public
        view
        returns (bool)
    {
         ff memory retrievedStruct = ffMapping[barCode];
         bytes32 hashedInput = keccak256(abi.encodePacked(hashedValue));
        bytes32 hashedValue = keccak256(abi.encodePacked(retrievedStruct.hashData));
        if (hashedValue == hashedInput) {
            return true;
        } else {
            return false;
        }
    }
}
