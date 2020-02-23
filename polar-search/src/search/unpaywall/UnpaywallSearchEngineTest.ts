import {UnpaywallSearchEngine} from "./UnpaywallSearchEngine";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Unpaywall} from "./Unpaywall";

describe('UnpaywallSearchEngine', function() {

    it("basic", async function() {

        const response: Unpaywall.Response = RESPONSE;
        const res = await UnpaywallSearchEngine.handleResponse(response);

        assertJSON(await res, {
            "entries": [
                {
                    "authors": [
                        {
                            "displayName": "G. Kucsko",
                            "firstName": "G.",
                            "lastName": "Kucsko"
                        },
                        {
                            "displayName": "P. C. Maurer",
                            "firstName": "P. C.",
                            "lastName": "Maurer"
                        },
                        {
                            "displayName": "N. Y. Yao",
                            "firstName": "N. Y.",
                            "lastName": "Yao"
                        },
                        {
                            "displayName": "M. Kubo",
                            "firstName": "M.",
                            "lastName": "Kubo"
                        },
                        {
                            "displayName": "H. J. Noh",
                            "firstName": "H. J.",
                            "lastName": "Noh"
                        },
                        {
                            "displayName": "P. K. Lo",
                            "firstName": "P. K.",
                            "lastName": "Lo"
                        },
                        {
                            "displayName": "H. Park",
                            "firstName": "H.",
                            "lastName": "Park"
                        },
                        {
                            "displayName": "M. D. Lukin",
                            "firstName": "M. D.",
                            "lastName": "Lukin"
                        }
                    ],
                    "doi": "10.1038/nature12373",
                    "id": "10.1038/nature12373",
                    "links": [
                        {
                            "disposition": "download",
                            "href": "https://dash.harvard.edu/bitstream/1/12285462/1/Nanometer-Scale%20Thermometry.pdf",
                            "type": "application/pdf"
                        },
                        {
                            "disposition": "landing",
                            "href": "http://nrs.harvard.edu/urn-3:HUL.InstRepos:12285462",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://europepmc.org/articles/pmc4221854?pdf=render",
                            "type": "application/pdf"
                        },
                        {
                            "disposition": "landing",
                            "href": "http://europepmc.org/articles/pmc4221854",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": null,
                            "type": "application/pdf"
                        },
                        {
                            "disposition": "landing",
                            "href": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4221854",
                            "type": "text/html"
                        },
                        {
                            "disposition": "download",
                            "href": "http://arxiv.org/pdf/1304.1068",
                            "type": "application/pdf"
                        },
                        {
                            "disposition": "landing",
                            "href": "http://arxiv.org/abs/1304.1068",
                            "type": "text/html"
                        }
                    ],
                    "published": "2013-07-31",
                    "publisher": "Springer Nature",
                    "title": "Nanometre-scale thermometry in a living cell",
                    "updated": "2019-06-27T03:29:12.641910"
                }
            ],
            "pagination": {
                "itemsPerPage": 1,
                "page": 0,
                "total": 1
            }
        });

    });

});

const RESPONSE: any = {
    "best_oa_location": {
        "endpoint_id": "8c9d8ba370a84253deb",
        "evidence": "oa repository (via OAI-PMH title and first author match)",
        "host_type": "repository",
        "is_best": true,
        "license": null,
        "pmh_id": "oai:dash.harvard.edu:1/12285462",
        "repository_institution": "Harvard University - Digital Access to Scholarship at Harvard (DASH)",
        "updated": "2019-08-18T13:35:53.203072",
        "url": "https://dash.harvard.edu/bitstream/1/12285462/1/Nanometer-Scale%20Thermometry.pdf",
        "url_for_landing_page": "http://nrs.harvard.edu/urn-3:HUL.InstRepos:12285462",
        "url_for_pdf": "https://dash.harvard.edu/bitstream/1/12285462/1/Nanometer-Scale%20Thermometry.pdf",
        "version": "publishedVersion"
    },
    "data_standard": 2,
    "doi": "10.1038/nature12373",
    "doi_url": "https://doi.org/10.1038/nature12373",
    "genre": "journal-article",
    "has_repository_copy": true,
    "is_oa": true,
    "journal_is_in_doaj": false,
    "journal_is_oa": false,
    "journal_issn_l": "0028-0836",
    "journal_issns": "0028-0836,1476-4687",
    "journal_name": "Nature",
    "oa_locations": [
        {
            "endpoint_id": "8c9d8ba370a84253deb",
            "evidence": "oa repository (via OAI-PMH title and first author match)",
            "host_type": "repository",
            "is_best": true,
            "license": null,
            "pmh_id": "oai:dash.harvard.edu:1/12285462",
            "repository_institution": "Harvard University - Digital Access to Scholarship at Harvard (DASH)",
            "updated": "2019-08-18T13:35:53.203072",
            "url": "https://dash.harvard.edu/bitstream/1/12285462/1/Nanometer-Scale%20Thermometry.pdf",
            "url_for_landing_page": "http://nrs.harvard.edu/urn-3:HUL.InstRepos:12285462",
            "url_for_pdf": "https://dash.harvard.edu/bitstream/1/12285462/1/Nanometer-Scale%20Thermometry.pdf",
            "version": "publishedVersion"
        },
        {
            "endpoint_id": "pubmedcentral.nih.gov",
            "evidence": "oa repository (via OAI-PMH doi match)",
            "host_type": "repository",
            "is_best": false,
            "license": null,
            "pmh_id": "oai:pubmedcentral.nih.gov:4221854",
            "repository_institution": "pubmedcentral.nih.gov",
            "updated": "2017-10-21T12:34:56.074727",
            "url": "http://europepmc.org/articles/pmc4221854?pdf=render",
            "url_for_landing_page": "http://europepmc.org/articles/pmc4221854",
            "url_for_pdf": "http://europepmc.org/articles/pmc4221854?pdf=render",
            "version": "acceptedVersion"
        },
        {
            "endpoint_id": null,
            "evidence": "oa repository (via pmcid lookup)",
            "host_type": "repository",
            "is_best": false,
            "license": null,
            "pmh_id": null,
            "repository_institution": null,
            "updated": "2019-09-23T22:52:26.378562",
            "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4221854",
            "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4221854",
            "url_for_pdf": null,
            "version": "acceptedVersion"
        },
        {
            "endpoint_id": "arXiv.org",
            "evidence": "oa repository (via OAI-PMH doi match)",
            "host_type": "repository",
            "is_best": false,
            "license": null,
            "pmh_id": "oai:arXiv.org:1304.1068",
            "repository_institution": "arXiv.org",
            "updated": "2017-10-22T03:05:35.844774",
            "url": "http://arxiv.org/pdf/1304.1068",
            "url_for_landing_page": "http://arxiv.org/abs/1304.1068",
            "url_for_pdf": "http://arxiv.org/pdf/1304.1068",
            "version": "submittedVersion"
        }
    ],
    "oa_status": "green",
    "published_date": "2013-07-31",
    "publisher": "Springer Nature",
    "title": "Nanometre-scale thermometry in a living cell",
    "updated": "2019-06-27T03:29:12.641910",
    "year": 2013,
    "z_authors": [
        {
            "family": "Kucsko",
            "given": "G."
        },
        {
            "family": "Maurer",
            "given": "P. C."
        },
        {
            "family": "Yao",
            "given": "N. Y."
        },
        {
            "family": "Kubo",
            "given": "M."
        },
        {
            "family": "Noh",
            "given": "H. J."
        },
        {
            "family": "Lo",
            "given": "P. K."
        },
        {
            "family": "Park",
            "given": "H."
        },
        {
            "family": "Lukin",
            "given": "M. D."
        }
    ]
};
