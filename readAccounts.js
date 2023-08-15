import fs from 'fs';

export default async function readAccounts() {
    let accountsArray = [];

    try {
        const data = fs.readFileSync('accounts.json', 'utf8');
        const accounts = await JSON.parse(data);

        for (const account in accounts) {
            accountsArray.push(accounts[account]);
        }
        console.log(`Read ${accountsArray.length} accounts`)
    } catch (err) {
        console.error(err);
    }

    return accountsArray;
}
