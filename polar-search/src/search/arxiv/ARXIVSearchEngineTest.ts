import {ARXIVSearchEngine} from "./ARXIVSearchEngine";
import {Files} from "polar-shared/src/util/Files";
import {Paths} from "polar-shared/src/util/Paths";
import { assertJSON } from "polar-test/src/test/Assertions";
import {DOMParser} from 'xmldom';

describe('ARXIVSearchEngine', function() {

    it("basic", async function() {

        if (process.platform === 'win32') {
            // TODO: there are newline issues with this test that can't be resolved
            return;
        }

        const path = Paths.join(__dirname, "test.xml");
        const buff = await Files.readFileAsync(path);
        const xml = buff.toString('utf-8');

        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");

        const response = ARXIVSearchEngine.handleResponse(doc);

        assertJSON(response, {
            "entries": [
                {
                    "authors": [
                        {
                            "displayName": "Pavel Ciaian"
                        },
                        {
                            "displayName": "Miroslava Rajcaniova"
                        },
                        {
                            "displayName": "d'Artis Kancs"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1405.4498v1",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1405.4498v1",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1405.4498v1",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2014-05-18T12:59:05Z",
                    "summary": {
                        "type": "text",
                        "value": "  This paper analyses the relationship between BitCoin price and supply-demand\n            fundamentals of BitCoin, global macro-financial indicators and BitCoin\n            attractiveness for investors. Using daily data for the period 2009-2014 and\n            applying time-series analytical mechanisms, we find that BitCoin market\n            fundamentals and BitCoin attractiveness for investors have a significant impact\n            on BitCoin price. Our estimates do not support previous findings that the\n            macro-financial developments are driving BitCoin price.\n        "
                    },
                    "title": "The Economics of BitCoin Price Formation",
                    "updated": "2014-05-18T12:59:05Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Wonse Kim"
                        },
                        {
                            "displayName": "Junseok Lee"
                        },
                        {
                            "displayName": "Kyungwon Kang"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1906.03430v1",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1906.03430v1",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1906.03430v1",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2019-06-08T09:38:28Z",
                    "summary": {
                        "type": "text",
                        "value": "  This paper investigates the effects of the launch of Bitcoin futures on the\n            intraday volatility of Bitcoin. Based on one-minute price data collected from\n            four cryptocurrency exchanges, we first examine the change in realized\n            volatility after the introduction of Bitcoin futures to investigate their\n            aggregate effects on the intraday volatility of Bitcoin. We then analyze the\n            effects in more detail utilizing the discrete Fourier transform. We show that\n            although the Bitcoin market became more volatile immediately after the\n            introduction of Bitcoin futures, over time it has become more stable than it\n            was before the introduction.\n        "
                    },
                    "title": "The Effects of the Introduction of Bitcoin Futures on the Volatility of\n            Bitcoin Returns",
                    "updated": "2019-06-08T09:38:28Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Pavel Ciaian"
                        },
                        {
                            "displayName": "d'Artis Kancs"
                        },
                        {
                            "displayName": "Miroslava Rajcaniova"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1812.09452v1",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1812.09452v1",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1812.09452v1",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2018-12-22T05:25:15Z",
                    "summary": {
                        "type": "text",
                        "value": "  This is the first paper that estimates the price determinants of BitCoin in a\n            Generalised Autoregressive Conditional Heteroscedasticity framework using high\n            frequency data. Derived from a theoretical model, we estimate BitCoin\n            transaction demand and speculative demand equations in a GARCH framework using\n            hourly data for the period 2013-2018. In line with the theoretical model, our\n            empirical results confirm that both the BitCoin transaction demand and\n            speculative demand have a statistically significant impact on the BitCoin price\n            formation. The BitCoin price responds negatively to the BitCoin velocity,\n            whereas positive shocks to the BitCoin stock, interest rate and the size of the\n            BitCoin economy exercise an upward pressure on the BitCoin price.\n        "
                    },
                    "title": "The Price of BitCoin: GARCH Evidence from High Frequency Data",
                    "updated": "2018-12-22T05:25:15Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Christian Decker"
                        },
                        {
                            "displayName": "Jochen Seidel"
                        },
                        {
                            "displayName": "Roger Wattenhofer"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1412.7935v1",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1412.7935v1",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1412.7935v1",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2014-12-26T12:58:13Z",
                    "summary": {
                        "type": "text",
                        "value": "  The Bitcoin system only provides eventual consistency. For everyday life, the\n            time to confirm a Bitcoin transaction is prohibitively slow. In this paper we\n            propose a new system, built on the Bitcoin blockchain, which enables strong\n            consistency. Our system, PeerCensus, acts as a certification authority, manages\n            peer identities in a peer-to-peer network, and ultimately enhances Bitcoin and\n            similar systems with strong consistency. Our extensive analysis shows that\n            PeerCensus is in a secure state with high probability. We also show how\n            Discoin, a Bitcoin variant that decouples block creation and transaction\n            confirmation, can be built on top of PeerCensus, enabling real-time payments.\n            Unlike Bitcoin, once transactions in Discoin are committed, they stay\n            committed.\n        "
                    },
                    "title": "Bitcoin Meets Strong Consistency",
                    "updated": "2014-12-26T12:58:13Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Ittay Eyal"
                        },
                        {
                            "displayName": "Adem Efe Gencer"
                        },
                        {
                            "displayName": "Emin Gun Sirer"
                        },
                        {
                            "displayName": "Robbert van Renesse"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1510.02037v2",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1510.02037v2",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1510.02037v2",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2015-10-07T17:35:32Z",
                    "summary": {
                        "type": "text",
                        "value": "  Cryptocurrencies, based on and led by Bitcoin, have shown promise as\n            infrastructure for pseudonymous online payments, cheap remittance, trustless\n            digital asset exchange, and smart contracts. However, Bitcoin-derived\n            blockchain protocols have inherent scalability limits that trade-off between\n            throughput and latency and withhold the realization of this potential.\n            This paper presents Bitcoin-NG, a new blockchain protocol designed to scale.\n            Based on Bitcoin's blockchain protocol, Bitcoin-NG is Byzantine fault tolerant,\n            is robust to extreme churn, and shares the same trust model obviating\n            qualitative changes to the ecosystem.\n            In addition to Bitcoin-NG, we introduce several novel metrics of interest in\n            quantifying the security and efficiency of Bitcoin-like blockchain protocols.\n            We implement Bitcoin-NG and perform large-scale experiments at 15% the size of\n            the operational Bitcoin system, using unchanged clients of both protocols.\n            These experiments demonstrate that Bitcoin-NG scales optimally, with bandwidth\n            limited only by the capacity of the individual nodes and latency limited only\n            by the propagation time of the network.\n        "
                    },
                    "title": "Bitcoin-NG: A Scalable Blockchain Protocol",
                    "updated": "2015-11-11T19:38:15Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Jamal Bouoiyour"
                        },
                        {
                            "displayName": "Refk Selmi"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1707.01284v1",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1707.01284v1",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1707.01284v1",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2017-07-05T09:39:04Z",
                    "summary": {
                        "type": "text",
                        "value": "  Much significant research has been done to investigate various facets of the\n            link between Bitcoin price and its fundamental sources. This study goes beyond\n            by looking into least to most influential factors-across the fundamental,\n            macroeconomic, financial, speculative and technical determinants as well as the\n            2016 events-which drove the value of Bitcoin in times of economic and\n            geopolitical chaos. We use a Bayesian quantile regression to inspect how the\n            structure of dependence of Bitcoin price and its determinants varies across the\n            entire conditional distribution of Bitcoin price movements. In doing so, three\n            groups of determinants were derived. The use of Bitcoin in trade and the\n            uncertainty surrounding China's deepening slowdown, Brexit and India's\n            demonetization were found to be the most potential contributors of Bitcoin\n            price when the market is improving. The intense anxiety over Donald Trump being\n            the president of United States was shown to be a positive determinant pushing\n            up the price of Bitcoin when the market is functioning around the normal mode.\n            The velocity of bitcoins in circulation, the gold price, the Venezuelan\n            currency demonetization and the hash rate were found to be the fundamentals\n            influencing the Bitcoin price when the market is heading into decline.\n        "
                    },
                    "title": "The Bitcoin price formation: Beyond the fundamental sources",
                    "updated": "2017-07-05T09:39:04Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Adam Hayes"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1805.07610v1",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1805.07610v1",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1805.07610v1",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2018-05-19T15:30:29Z",
                    "summary": {
                        "type": "text",
                        "value": "  This study back-tests a marginal cost of production model proposed to value\n            the digital currency bitcoin. Results from both conventional regression and\n            vector autoregression (VAR) models show that the marginal cost of production\n            plays an important role in explaining bitcoin prices, challenging recent\n            allegations that bitcoins are essentially worthless. Even with markets pricing\n            bitcoin in the thousands of dollars each, the valuation model seems robust. The\n            data show that a price bubble that began in the Fall of 2017 resolved itself in\n            early 2018, converging with the marginal cost model. This suggests that while\n            bubbles may appear in the bitcoin market, prices will tend to this bound and\n            not collapse to zero.\n        "
                    },
                    "title": "Bitcoin price and its marginal cost of production: support for a\n            fundamental value",
                    "updated": "2018-05-19T15:30:29Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Uroš Hercog"
                        },
                        {
                            "displayName": "Andraž Povše"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1907.01538v1",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1907.01538v1",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1907.01538v1",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2019-07-02T17:42:54Z",
                    "summary": {
                        "type": "text",
                        "value": "  Determining the trust of an individual Bitcoin wallet is a difficult problem.\n            There are no ratings, that offer vendors or exchanges meaningful information\n            about the level of the taint of Bitcoins they are receiving. Lack of such\n            information places exchanges liable in an event when the received Bitcoins are\n            stolen or ill-gotten. In this paper, we try to solve this problem by\n            introducing a Bitcoin address taint score called TaintRank. It provides insight\n            into a specific wallet by taking the addresses it interacted with throughout\n            history into consideration. This ranking method provides such Bitcoin exchange\n            companies insight with whom they are trading.\n        "
                    },
                    "title": "Taint analysis of the Bitcoin network",
                    "updated": "2019-07-02T17:42:54Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Mauro Conti"
                        },
                        {
                            "displayName": "Sandeep Kumar E"
                        },
                        {
                            "displayName": "Chhagan Lal"
                        },
                        {
                            "displayName": "Sushmita Ruj"
                        }
                    ],
                    "doi": "10.1109/COMST.2018.2842460",
                    "id": "10.1109/COMST.2018.2842460",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1706.00916v3",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1706.00916v3",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2017-06-03T09:11:55Z",
                    "summary": {
                        "type": "text",
                        "value": "  Bitcoin is a popular cryptocurrency that records alltransactions in a\n            distributed append-only public ledger calledblockchain. The security of Bitcoin\n            heavily relies on the incentive-compatible proof-of-work (PoW) based\n            distributed consensus pro-tocol, which is run by network nodes called miners.\n            In exchangefor the incentive, the miners are expected to honestly maintainthe\n            blockchain. Since its launch in 2009, Bitcoin economy hasgrown at an enormous\n            rate, and it is now worth about 170 billions of dollars. This exponential\n            growth in the market valueof Bitcoin motivates adversaries to exploit\n            weaknesses for profit,and researchers to discover new vulnerabilities in the\n            system,propose countermeasures, and predict upcoming trends.In this paper, we\n            present a systematic survey that covers thesecurity and privacy aspects of\n            Bitcoin. We start by presenting anoverview of the Bitcoin protocol and its\n            major components alongwith their functionality and interactions within the\n            system. Wereview the existing vulnerabilities in Bitcoin and its\n            underlyingmajor technologies such as blockchain and PoW based\n            consensusprotocol. These vulnerabilities lead to the execution of\n            varioussecurity threats to the normal functionality of Bitcoin. Wethen discuss\n            the feasibility and robustness of the state-of-the-art security solutions.\n            Additionally, we present current privacyand anonymity considerations in Bitcoin\n            and discuss the privacy-related threats to Bitcoin users along with the\n            analysis of theexisting privacy-preserving solutions. Finally, we summarize\n            thecritical open challenges and suggest directions for future researchtowards\n            provisioning stringent security and privacy techniquesfor Bitcoin.\n        "
                    },
                    "title": "A Survey on Security and Privacy Issues of Bitcoin",
                    "updated": "2017-12-25T18:25:27Z"
                },
                {
                    "authors": [
                        {
                            "displayName": "Jan A. Bergstra"
                        },
                        {
                            "displayName": "Peter Weijland"
                        }
                    ],
                    "id": "http://arxiv.org/abs/1402.4778v1",
                    "links": [
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1402.4778v1",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1402.4778v1",
                            "type": "application/pdf"
                        }
                    ],
                    "published": "2014-02-19T19:25:15Z",
                    "summary": {
                        "type": "text",
                        "value": "  The question \"what is Bitcoin\" allows for many answers depending on the\n            objectives aimed at when providing such answers. The question addressed in this\n            paper is to determine a top-level classification, or type, for Bitcoin. We will\n            classify Bitcoin as a system of type money-like informational commodity (MLIC).\n        "
                    },
                    "title": "Bitcoin: a Money-like Informational Commodity",
                    "updated": "2014-02-19T19:25:15Z"
                }
            ],
            "pagination": {
                "itemsPerPage": 10,
                "page": 0,
                "total": 10
            }
        }, {ignoreWhitespace: true});
    });

});
