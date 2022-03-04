const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    date: Date,
    email: String,
    tokenAmount: Number,
    walletAddress: String,
    resolved: String
});

module.exports = mongoose.model("Log", logSchema);

//nie wszyscy klienci dokończą zakupy poprzez bramke, 
//a dlugosc zycia linka do platnosci bramki to 60 min
//
//resolved: [no, yes, pending] = z zalozenia 3 stany, 
//lecz ten klucz przyjmuje dowolny String wiec to jak to bedzie
//w bazie napisane zalezy juz od co sobie przyjmiemy na opisanie
//osoby co jeszcze nie zaplacila a link 'zyje' i sie nie zamknal
