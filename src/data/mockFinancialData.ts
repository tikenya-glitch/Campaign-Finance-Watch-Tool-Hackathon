export interface FinancialTransaction {
    id: string;
    party: string;
    donor: string;
    donorType: string;
    donationType: 'MONETARY' | 'IN-KIND';
    date: string;
    amount: number;
}

export const donorTypes = ['Political Parties Fund'];

export const mockTransactions: FinancialTransaction[] = [
    {
        "id": "orpp-2013-0",
        "party": "TNA (The National Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2013-07-01",
        "amount": 88834394.4
    },
    {
        "id": "orpp-2013-1",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2013-07-01",
        "amount": 78080095.2
    },
    {
        "id": "orpp-2013-2",
        "party": "URP (United Republican Party)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2013-07-01",
        "amount": 28025510.4
    },
    {
        "id": "orpp-2014-3",
        "party": "TNA (The National Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2014-07-01",
        "amount": 155849814.6
    },
    {
        "id": "orpp-2014-4",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2014-07-01",
        "amount": 136982623.2
    },
    {
        "id": "orpp-2014-5",
        "party": "URP (United Republican Party)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2014-07-01",
        "amount": 49167562.2
    },
    {
        "id": "orpp-2015-6",
        "party": "TNA (The National Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2015-07-01",
        "amount": 158979845
    },
    {
        "id": "orpp-2015-7",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2015-07-01",
        "amount": 139647018
    },
    {
        "id": "orpp-2015-8",
        "party": "URP (United Republican Party)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2015-07-01",
        "amount": 50213137
    },
    {
        "id": "orpp-2016-9",
        "party": "TNA (The National Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2016-07-01",
        "amount": 149396786.95
    },
    {
        "id": "orpp-2016-10",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2016-07-01",
        "amount": 131310799.51
    },
    {
        "id": "orpp-2016-11",
        "party": "URP (United Republican Party)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2016-07-01",
        "amount": 47131758.38
    },
    {
        "id": "orpp-2016-12",
        "party": "WDM (Wiper Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2016-07-01",
        "amount": 24140215.16
    },
    {
        "id": "orpp-2017-13",
        "party": "Jubilee Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2017-07-01",
        "amount": 240374863
    },
    {
        "id": "orpp-2017-14",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2017-07-01",
        "amount": 112255637
    },
    {
        "id": "orpp-2018-15",
        "party": "Jubilee Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2018-07-01",
        "amount": 434648469.9
    },
    {
        "id": "orpp-2018-16",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2018-07-01",
        "amount": 202982030.1
    },
    {
        "id": "orpp-2019-17",
        "party": "Jubilee Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2019-07-01",
        "amount": 564164078.68
    },
    {
        "id": "orpp-2019-18",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2019-07-01",
        "amount": 263466421.32
    },
    {
        "id": "orpp-2020-19",
        "party": "Jubilee Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2020-07-01",
        "amount": 514980477.19
    },
    {
        "id": "orpp-2020-20",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2020-07-01",
        "amount": 430497522.81
    },
    {
        "id": "orpp-2021-21",
        "party": "Jubilee Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2021-07-01",
        "amount": 1020104806.7
    },
    {
        "id": "orpp-2021-22",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2021-07-01",
        "amount": 1331392193.3
    },
    {
        "id": "orpp-2022-23",
        "party": "NARC-Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 4529021
    },
    {
        "id": "orpp-2022-24",
        "party": "Party of Independent Candidate of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 526751
    },
    {
        "id": "orpp-2022-25",
        "party": "Devolution Empowerment Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 8256187
    },
    {
        "id": "orpp-2022-26",
        "party": "Kenya National Congress",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 1109977
    },
    {
        "id": "orpp-2022-27",
        "party": "WDM (Wiper Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 43271747
    },
    {
        "id": "orpp-2022-28",
        "party": "Democratic Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 3286712
    },
    {
        "id": "orpp-2022-29",
        "party": "Party of National Unity",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 2672766
    },
    {
        "id": "orpp-2022-30",
        "party": "UDA (United Democratic Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 345800493
    },
    {
        "id": "orpp-2022-31",
        "party": "Kenya Social Congress",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 729227
    },
    {
        "id": "orpp-2022-32",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 184717678
    },
    {
        "id": "orpp-2022-33",
        "party": "FORD-Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 15494719
    },
    {
        "id": "orpp-2022-34",
        "party": "Progressive Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 1889232
    },
    {
        "id": "orpp-2022-35",
        "party": "Jubilee Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 81019735
    },
    {
        "id": "orpp-2022-36",
        "party": "Maendeleo Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 348707
    },
    {
        "id": "orpp-2022-37",
        "party": "NARC",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 3087540
    },
    {
        "id": "orpp-2022-38",
        "party": "Kenya African Democratic Union-Asili",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 287508
    },
    {
        "id": "orpp-2022-39",
        "party": "Communist Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 627485
    },
    {
        "id": "orpp-2022-40",
        "party": "KANU",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 14403820
    },
    {
        "id": "orpp-2022-41",
        "party": "Safina Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 1880866
    },
    {
        "id": "orpp-2022-42",
        "party": "Chama Cha Uzalendo",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 2351440
    },
    {
        "id": "orpp-2022-43",
        "party": "National Agenda Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 1340177
    },
    {
        "id": "orpp-2022-44",
        "party": "People’s Empowerment Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 501487
    },
    {
        "id": "orpp-2022-45",
        "party": "Peoples Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 476221
    },
    {
        "id": "orpp-2022-46",
        "party": "United Democratic Movement",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 16107817
    },
    {
        "id": "orpp-2022-47",
        "party": "Shirikisho Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 411578
    },
    {
        "id": "orpp-2022-48",
        "party": "United Party of Independent Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 5462800
    },
    {
        "id": "orpp-2022-49",
        "party": "Federal Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 753751
    },
    {
        "id": "orpp-2022-50",
        "party": "Muungano Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 4039554
    },
    {
        "id": "orpp-2022-51",
        "party": "Chama Cha Mashinani",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 4862391
    },
    {
        "id": "orpp-2022-52",
        "party": "Ubuntu People’s Forum",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 1197853
    },
    {
        "id": "orpp-2022-53",
        "party": "ANC (Amani National Congress)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 15949009
    },
    {
        "id": "orpp-2022-54",
        "party": "United Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 3220967
    },
    {
        "id": "orpp-2022-55",
        "party": "People’s Trust Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 504946
    },
    {
        "id": "orpp-2022-56",
        "party": "MCCP (Maendeleo Chap Chap)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 7592964
    },
    {
        "id": "orpp-2022-57",
        "party": "Movement for Democracy and Growth",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 5873510
    },
    {
        "id": "orpp-2022-58",
        "party": "Justice and Freedom Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 165951
    },
    {
        "id": "orpp-2022-59",
        "party": "Grand Dream Development Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 279596
    },
    {
        "id": "orpp-2022-60",
        "party": "United Progressive Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 5198397
    },
    {
        "id": "orpp-2022-61",
        "party": "The Service Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 6323230
    },
    {
        "id": "orpp-2022-62",
        "party": "National Ordinary People Empowerment Union",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 810349
    },
    {
        "id": "orpp-2022-63",
        "party": "National Reconstruction Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 2037417
    },
    {
        "id": "orpp-2022-64",
        "party": "DAP-K",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 18959987
    },
    {
        "id": "orpp-2022-65",
        "party": "Chama Cha Kazi",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 3914496
    },
    {
        "id": "orpp-2022-66",
        "party": "Tujibebe Wakenya Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 4542628
    },
    {
        "id": "orpp-2022-67",
        "party": "Kenya Union Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 5694772
    },
    {
        "id": "orpp-2022-68",
        "party": "PAA (Pamoja African Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 6891431
    },
    {
        "id": "orpp-2022-69",
        "party": "Mabandiliko Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 382340
    },
    {
        "id": "orpp-2022-70",
        "party": "Green Thinking Action Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2022-07-01",
        "amount": 349069
    },
    {
        "id": "orpp-2023-71",
        "party": "NARC-Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 3115272
    },
    {
        "id": "orpp-2023-72",
        "party": "Party of Independent Candidate of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 362324
    },
    {
        "id": "orpp-2023-73",
        "party": "Devolution Empowerment Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 5678991
    },
    {
        "id": "orpp-2023-74",
        "party": "Kenya National Congress",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 763494
    },
    {
        "id": "orpp-2023-75",
        "party": "WDM (Wiper Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 29764329
    },
    {
        "id": "orpp-2023-76",
        "party": "Democratic Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 2260754
    },
    {
        "id": "orpp-2023-77",
        "party": "Party of National Unity",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 1838453
    },
    {
        "id": "orpp-2023-78",
        "party": "UDA (United Democratic Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 237857736
    },
    {
        "id": "orpp-2023-79",
        "party": "Kenya Social Congress",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 501597
    },
    {
        "id": "orpp-2023-80",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 127057449
    },
    {
        "id": "orpp-2023-81",
        "party": "FORD-Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 10657992
    },
    {
        "id": "orpp-2023-82",
        "party": "Progressive Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 1299502
    },
    {
        "id": "orpp-2023-83",
        "party": "Jubilee Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 55729159
    },
    {
        "id": "orpp-2023-84",
        "party": "Maendeleo Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 239857
    },
    {
        "id": "orpp-2023-85",
        "party": "NARC",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 2123754
    },
    {
        "id": "orpp-2023-86",
        "party": "Kenya African Democratic Union-Asili",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 197761
    },
    {
        "id": "orpp-2023-87",
        "party": "Communist Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 431614
    },
    {
        "id": "orpp-2023-88",
        "party": "KANU",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 9907621
    },
    {
        "id": "orpp-2023-89",
        "party": "Safina Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 1293748
    },
    {
        "id": "orpp-2023-90",
        "party": "Chama Cha Uzalendo",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 1617431
    },
    {
        "id": "orpp-2023-91",
        "party": "National Agenda Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 921836
    },
    {
        "id": "orpp-2023-92",
        "party": "People’s Empowerment Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 344946
    },
    {
        "id": "orpp-2023-93",
        "party": "Peoples Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 327567
    },
    {
        "id": "orpp-2023-94",
        "party": "United Democratic Movement",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 11079709
    },
    {
        "id": "orpp-2023-95",
        "party": "Shirikisho Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 283103
    },
    {
        "id": "orpp-2023-96",
        "party": "United Party of Independent Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 3757569
    },
    {
        "id": "orpp-2023-97",
        "party": "Federal Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 518465
    },
    {
        "id": "orpp-2023-98",
        "party": "Muungano Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 2778594
    },
    {
        "id": "orpp-2023-99",
        "party": "Chama Cha Mashinani",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 3344580
    },
    {
        "id": "orpp-2023-100",
        "party": "Ubuntu People’s Forum",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 823939
    },
    {
        "id": "orpp-2023-101",
        "party": "ANC (Amani National Congress)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 10970474
    },
    {
        "id": "orpp-2023-102",
        "party": "United Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 2215532
    },
    {
        "id": "orpp-2023-103",
        "party": "People’s Trust Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 347326
    },
    {
        "id": "orpp-2023-104",
        "party": "MCCP (Maendeleo Chap Chap)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 5222795
    },
    {
        "id": "orpp-2023-105",
        "party": "Movement for Democracy and Growth",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 4040075
    },
    {
        "id": "orpp-2023-106",
        "party": "Justice and Freedom Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 114149
    },
    {
        "id": "orpp-2023-107",
        "party": "Grand Dream Development Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 192319
    },
    {
        "id": "orpp-2023-108",
        "party": "United Progressive Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 3575701
    },
    {
        "id": "orpp-2023-109",
        "party": "The Service Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 4349413
    },
    {
        "id": "orpp-2023-110",
        "party": "National Ordinary People Empowerment Union",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 557396
    },
    {
        "id": "orpp-2023-111",
        "party": "National Reconstruction Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 1401430
    },
    {
        "id": "orpp-2023-112",
        "party": "DAP-K",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 13041565
    },
    {
        "id": "orpp-2023-113",
        "party": "Chama Cha Kazi",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 2692573
    },
    {
        "id": "orpp-2023-114",
        "party": "Tujibebe Wakenya Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 3124632
    },
    {
        "id": "orpp-2023-115",
        "party": "Kenya Union Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 3917130
    },
    {
        "id": "orpp-2023-116",
        "party": "PAA (Pamoja African Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 4740248
    },
    {
        "id": "orpp-2023-117",
        "party": "Mabadiliko Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 262992
    },
    {
        "id": "orpp-2023-118",
        "party": "Green Thinking Action Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2023-07-01",
        "amount": 240106
    },
    {
        "id": "orpp-2026-119",
        "party": "Peoples Liberation Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 7203075
    },
    {
        "id": "orpp-2026-120",
        "party": "Party of Independent Candidate of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 837759
    },
    {
        "id": "orpp-2026-121",
        "party": "Devolution Empowerment Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 13130858
    },
    {
        "id": "orpp-2026-122",
        "party": "Kenya National Congress",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 1765336
    },
    {
        "id": "orpp-2026-123",
        "party": "WDM (Wiper Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 68820531
    },
    {
        "id": "orpp-2026-124",
        "party": "Democratic Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 5227274
    },
    {
        "id": "orpp-2026-125",
        "party": "Party of National Unity",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 4250837
    },
    {
        "id": "orpp-2026-126",
        "party": "UDA (United Democratic Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 549970254
    },
    {
        "id": "orpp-2026-127",
        "party": "Kenya Social Congress",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 1159783
    },
    {
        "id": "orpp-2026-128",
        "party": "ODM (Orange Democratic Movement)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 293779882
    },
    {
        "id": "orpp-2026-129",
        "party": "FORD-Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 24643211
    },
    {
        "id": "orpp-2026-130",
        "party": "Progressive Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 3004684
    },
    {
        "id": "orpp-2026-131",
        "party": "Jubilee Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 128855930
    },
    {
        "id": "orpp-2026-132",
        "party": "Maendeleo Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 554592
    },
    {
        "id": "orpp-2026-133",
        "party": "NARC",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 4910505
    },
    {
        "id": "orpp-2026-134",
        "party": "Kenya African Democratic Union-Asili",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 457260
    },
    {
        "id": "orpp-2026-135",
        "party": "Communist Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 997969
    },
    {
        "id": "orpp-2026-136",
        "party": "KANU",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 22908217
    },
    {
        "id": "orpp-2026-137",
        "party": "Safina Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 2991379
    },
    {
        "id": "orpp-2026-138",
        "party": "Chama Cha Uzalendo",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 3739793
    },
    {
        "id": "orpp-2026-139",
        "party": "National Agenda Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 2131453
    },
    {
        "id": "orpp-2026-140",
        "party": "People’s Empowerment Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 797579
    },
    {
        "id": "orpp-2026-141",
        "party": "Peoples Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 757395
    },
    {
        "id": "orpp-2026-142",
        "party": "United Democratic Movement",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 25618298
    },
    {
        "id": "orpp-2026-143",
        "party": "Shirikisho Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 654585
    },
    {
        "id": "orpp-2026-144",
        "party": "United Party of Independent Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 8688182
    },
    {
        "id": "orpp-2026-145",
        "party": "Federal Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 1198785
    },
    {
        "id": "orpp-2026-146",
        "party": "Muungano Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 6424613
    },
    {
        "id": "orpp-2026-147",
        "party": "Chama Cha Mashinani",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 7733276
    },
    {
        "id": "orpp-2026-148",
        "party": "Ubuntu People’s Forum",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 1905097
    },
    {
        "id": "orpp-2026-149",
        "party": "ANC (Amani National Congress)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 25365726
    },
    {
        "id": "orpp-2026-150",
        "party": "United Democratic Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 5122711
    },
    {
        "id": "orpp-2026-151",
        "party": "People’s Trust Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 803080
    },
    {
        "id": "orpp-2026-152",
        "party": "MCCP (Maendeleo Chap Chap)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 12076051
    },
    {
        "id": "orpp-2026-153",
        "party": "Movement for Democracy and Growth",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 9341386
    },
    {
        "id": "orpp-2026-154",
        "party": "Justice and Freedom Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 263933
    },
    {
        "id": "orpp-2026-155",
        "party": "Grand Dream Development Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 444677
    },
    {
        "id": "orpp-2026-156",
        "party": "United Progressive Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 8267669
    },
    {
        "id": "orpp-2026-157",
        "party": "The Service Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 10056632
    },
    {
        "id": "orpp-2026-158",
        "party": "National Ordinary People Empowerment Union",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 1288800
    },
    {
        "id": "orpp-2026-159",
        "party": "National Reconstruction Alliance",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 3240361
    },
    {
        "id": "orpp-2026-160",
        "party": "DAP-K",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 30154465
    },
    {
        "id": "orpp-2026-161",
        "party": "Chama Cha Kazi",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 6225718
    },
    {
        "id": "orpp-2026-162",
        "party": "Tujibebe Wakenya Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 7224716
    },
    {
        "id": "orpp-2026-163",
        "party": "Kenya Union Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 9057116
    },
    {
        "id": "orpp-2026-164",
        "party": "PAA (Pamoja African Alliance)",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 10960315
    },
    {
        "id": "orpp-2026-165",
        "party": "Mabadiliko Party of Kenya",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 608084
    },
    {
        "id": "orpp-2026-166",
        "party": "Green Thinking Action Party",
        "donor": "Office of the Registrar of Political Parties (ORPP)",
        "donorType": "Political Parties Fund",
        "donationType": "MONETARY",
        "date": "2026-07-01",
        "amount": 555169
    }
];

export const getAggregatedData = (transactions: FinancialTransaction[]) => {
    const totalByParty = transactions.reduce((acc, tx) => {
        acc[tx.party] = (acc[tx.party] || 0) + tx.amount;
        return acc;
    }, {} as Record<string, number>);

    return { totalByParty };
};