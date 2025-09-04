in this code for just demo purposes we need to show that blockchain part is working. Just implement the product pricing entry part in the blockchain. based on this project all the references in the /references folder.

based on that just in the from the marketplace/company-portal part. while company tries to add a product pricing entry. it should be added in the blockchain. and show the transaction hash in the UI. (also store the transaction hash in the database for future reference (currently just store in the current session)). while updating the product pricing entry. it should also be updated in the blockchain. and show the transaction hash in the UI. (also link the old transaction hash with the new transaction hash in the database for future reference (currently just store in the current session)).

use docker compose to run the blockchain locally. (cause this project will just use private blockchain internally). use ganache for that.

we have a self hosted Public blockchain node (this will be publicly available for Bangladesh only) after adding the product pricing entry in the local blockchain. also add the transaction hash in the public blockchain node. We will not use any wallet for this.

note: while company is adding the product pricing entry. they need to verify their identity using public/private key pair. So implement that part as well. Company will have their own private key. while adding the product pricing entry they need to sign the transaction using their private key. and we will verify the signature using their public key. (for demo purposes just generate a public/private key pair for the company and use that).

No separate backend service is needed. Just implement everything in the nextjs app. (we can use nextjs api routes for backend logic if needed). Also for that part only if database is needed use sqlite for that. (we can use prisma as ORM).

The goal is to make to show the demo as first as possible within one hour. so keep it simple and straight forward. no need to make it production ready. just make it work for demo purpose.

DO THE ACTUAL TRANSACTION IN THE LOCAL BLOCKCHAIN. AND JUST STORE THE TRANSACTION HASH IN THE PUBLIC BLOCKCHAIN NODE. (NO NEED TO DO THE ACTUAL TRANSACTION IN THE PUBLIC BLOCKCHAIN NODE).
