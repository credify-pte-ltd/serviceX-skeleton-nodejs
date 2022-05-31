process.env.CONTEXT_ENV = 'Jest';

const request = require("supertest");
const app = require("../../app");
const {DEFAULT_PATH, STANDARD_SCOPES} = require("../../utils/constants");
const TestConfig = require("../utils/testConfig");

const prefix = "/v1"

const testKey = {
  "private_key": {
    "base64_url": "MIIJQwIBADANBgkqhkiG9w0BAQEFAASCCS0wggkpAgEAAoICAQDrEavVupOf-G7U83oh0TKLK0U-9BdY4cgPCe66gyLodY9NF7-r9NgZHlsSOaXXTCEJOo8_rb-JFW34rmmRICp6mheB_dHwuW1VTgRK7XW1hb8DhA8GolMwdLfPHraIuJoTrtdgxzEXSNOH0ecmE4KdHDvP1_j79VF3ROuNh6m2x2MeX5ipL1vKb9lNm18Z-cwW8iN900oUPh21DcbyS4BUfSsdcOrgzzoZn7damAQAdlIupq_WB47AkOXGgOgrAsjVxrXAkONt7bi87Oa_HInvleHQWG6z2srwvT-3c-3CDULokou42Zumunr6q-zj_yF4tRGUOagtkMZ2SR4DVbRiz33BNT8P54Ht5YAxQ8cq96ygXwAXnz6nNSDsS09S2A2LL_bjzzzNVJGTxKSnxC1N_jG_kqUm7izr3q1sQQqNT5C5ylDn_5B-gZS84V2iP-P3a2wqd_PPeQLx3XmY17GTfHyfCzwdm0u-lSEsu8sJ6SgpixBCSuCxPouC90kSrI1d4ydxJRCPhUfjovcKpqp4wlLLHTNR3WHMlDSX5p2DEJhheu32phiRq4nNps7WG2IFQlk3G667QrW0AB7l0FWrYbjkQ-Lu6zbuYZNQf--7Wc1vjDO2gENvjQSGON9u6J3P4eTvMTyh7EeIBpcUVcgGjuIcM2f-rnxqQInp52MZQQIDAQABAoICAQDX-uGOO6Jd7g4vPRIvNh4hfn1eLTmyYajGIJMm7UxKl5E1_ScP4KQY2CpHIY59taX468QodwSv-G-VePLn88zz3tbQihy1-Dk7krYg_fMT-LIbkd-YcdbLg8JK3GZMUojGovOjKQGy6ifo9_RQqMZugj12Z3KOVcUnN7zRyh8mICazBpSmhivpYUEgrCwCGuDpCEuR1WuQE86JxwHPJ43eky7lGxXDvsMcPgJii5_JqO0zjdWrakBAMCHedBxdQG609KGUL8u2-h-t_mC4oYkfB_B11HrKZ7Hk5Y1AipSeoj6in9se2VnJJDfQT90VUxo25O8k6KDcVNP0ZJPd7oYQLLeqf4EeIvKwK7lYZ7lqFYa54L2Jt4FWagHjjxUWkVNBH7UwaCTS3xU1FTeBsL7evMlTdsJFsbBhAoqoblxx9JOj0BObCQSVbvvwplDGK6AImW2oV4kmNgMbw7kiVaUv7CO1vZlG5E4aKa1C4w1DPcn9w3AI8yrzV428VcqX6rgaMHIsLMCKGwN0G6Yke7aAGbJPgj9EXDzAfnK9ie-3oSWpjs1joFiqljPVUv9NQxeDxXFpMtIq2LR4ahcdly_M_7Pu_51kdEDqAUOn9UoMxMmgaAtsXmGNo-YNQQ1dja-GAgvp2fi_SUV8PaZ_G-4pLNdRFW2NZW_WQRWt6ydK0QKCAQEA73per7eE3HDr2Jn53A1qxgx557XWUelVZoxG9mTleCj1npkJWXo9BTH69-UHjrPhOJVAXJQftzH8wG9TRZcIsoYaqNgIdmlts2_ouEzUe6mNA3nhqaSPSf5mcgf7UEmGRa_SkCVPLOxunrZIon15hyn6goz3o1QSbT-HlotECPVqrwgCkvNS_kHWsG4UUT3q-PoyYBu1-5sCT2-_zaB66ARAW6pDdUyokcQRW-_PnrpiZCQKpaK-NkTb0yOokL7WjLiYWlD_lHetk6Conhg4go4UlBlQdPvYNe-hBulwBXcH4Ggu42YVMYb75FvDXPxc9E-hUFJv8C-tf0CSkMOZ1QKCAQEA-0luN3DXjlSFLx8BqrHmMGxZXcv0sgHIk-fEdffGI3N3_rqoSqu3aS78PBhlaAANjdYlMOXciOjE2uAzWGRv1RTSyW-b3PEC0eNF8dVe9bFXCwWS-b6O_M6WHN6IVQzeZVm5yksPAx4BDXvoN5bs61NwiZmWt0wJ-QfFvmwLfQu1WfetqqVsVRrtyLISshNYyqQZ6FSKx9EZ2a_luqTO2HR0Bei9Hmur0RwA2yUn5snddQj11nWR6Kag-QSlEBYVnylLW3xLejcYfdxfgqKeaGTaJvNL4sW35DamqQ_p__NLIVxSWp-0hMFzZfd10B3gUvAN62-Bgjncvj4kk7TrvQKCAQAiCa-ZpCkDOB2djM0hxNpvSeit0X-j5tlXmQqhDNg8yv2WTEQy7pfrvB3izC_VzaVuaHBceEVFwZoeM_SPCJeY4Ey7wPD6-6M3BOn8ABeXeBLt8o3rkdM3_ivLe2zyDXFDSGlSSatGRFi4wEn0pob2ejX8BlNQaKux0XzRHfxOlatTM31CK8mZD_yW2R6UKYvTVaSBWo70MyUR611EudGeVrRbEwlBi-LNzSN2gNBuzCkd-K12u3nztrfT-9aCtE1EdRxagfbBwHzwZb5xshmeHNm57xsrdXxWtjeaBuYAMNnywHwhoCnU_02gOJa9CbWgmAzioMT-S5iKZMAwSUz9AoIBAA0xmNDeYuL9OxTzStIcjxqBxdtv5wQlpdNmOuF6xfN8j5NXV5i8FWA3cFTzbveb8Ro-YSuFFiQ2HIfld6yvcVO9ySd8bbGXEe_VQAnnixnZWtmgTExCnh1V93nCkWPtzguCP4gIktw2ChYcKGAq03uzoNgIsWokWu2xY8eQwrWpFLeJkpvAHcUGKe_8sZCaBXJ2VUnmjnbZWsMcQjKfjqC81I6u3qcnPhk3oC_hbovmk3MeqlG9UJDnltIcVVJX5oC52VQPXaMoG2gYVwdz5F9U1ENxSM26VeJsoCmGRWID8zDoOQa7Fe5WfemfqZboyqtwITr4WtNsmFOAzcjXmf0CggEBANCwmckvsSJrVAhc3tTCDT5sKQA7lyqEx7AXpDIUA9D0NaaetL7Yh_YMHnADnrvNsc5_kvgaTdNk8sgzsp0J3dyPD-xBnROGyg_Jt7h7gTPzh2q6y6NRSVbBBnzAp2NSNbIkZm5tg8G-soU9UB50vg0sBUILBpWUX9LlZMVXzbxBo5i2omvVTP1gRRJzxj0itf3TSEJnBvY9KInrpI8RzfzoHrrC_V4_ftZH7yAmVyH3gw03yagoRrnZagUydf7cXbP1YoOBizTgt_WBiQk47Ym4JvEWDTHmEsT4snYjujiMvAlAS37JyvWDosQZlO5eDVv0XR3aNy5pOR_ouC0o8a8",
    "plain_pem": "-----BEGIN PRIVATE KEY-----\nMIIJQwIBADANBgkqhkiG9w0BAQEFAASCCS0wggkpAgEAAoICAQDrEavVupOf+G7U\n83oh0TKLK0U+9BdY4cgPCe66gyLodY9NF7+r9NgZHlsSOaXXTCEJOo8/rb+JFW34\nrmmRICp6mheB/dHwuW1VTgRK7XW1hb8DhA8GolMwdLfPHraIuJoTrtdgxzEXSNOH\n0ecmE4KdHDvP1/j79VF3ROuNh6m2x2MeX5ipL1vKb9lNm18Z+cwW8iN900oUPh21\nDcbyS4BUfSsdcOrgzzoZn7damAQAdlIupq/WB47AkOXGgOgrAsjVxrXAkONt7bi8\n7Oa/HInvleHQWG6z2srwvT+3c+3CDULokou42Zumunr6q+zj/yF4tRGUOagtkMZ2\nSR4DVbRiz33BNT8P54Ht5YAxQ8cq96ygXwAXnz6nNSDsS09S2A2LL/bjzzzNVJGT\nxKSnxC1N/jG/kqUm7izr3q1sQQqNT5C5ylDn/5B+gZS84V2iP+P3a2wqd/PPeQLx\n3XmY17GTfHyfCzwdm0u+lSEsu8sJ6SgpixBCSuCxPouC90kSrI1d4ydxJRCPhUfj\novcKpqp4wlLLHTNR3WHMlDSX5p2DEJhheu32phiRq4nNps7WG2IFQlk3G667QrW0\nAB7l0FWrYbjkQ+Lu6zbuYZNQf++7Wc1vjDO2gENvjQSGON9u6J3P4eTvMTyh7EeI\nBpcUVcgGjuIcM2f+rnxqQInp52MZQQIDAQABAoICAQDX+uGOO6Jd7g4vPRIvNh4h\nfn1eLTmyYajGIJMm7UxKl5E1/ScP4KQY2CpHIY59taX468QodwSv+G+VePLn88zz\n3tbQihy1+Dk7krYg/fMT+LIbkd+YcdbLg8JK3GZMUojGovOjKQGy6ifo9/RQqMZu\ngj12Z3KOVcUnN7zRyh8mICazBpSmhivpYUEgrCwCGuDpCEuR1WuQE86JxwHPJ43e\nky7lGxXDvsMcPgJii5/JqO0zjdWrakBAMCHedBxdQG609KGUL8u2+h+t/mC4oYkf\nB/B11HrKZ7Hk5Y1AipSeoj6in9se2VnJJDfQT90VUxo25O8k6KDcVNP0ZJPd7oYQ\nLLeqf4EeIvKwK7lYZ7lqFYa54L2Jt4FWagHjjxUWkVNBH7UwaCTS3xU1FTeBsL7e\nvMlTdsJFsbBhAoqoblxx9JOj0BObCQSVbvvwplDGK6AImW2oV4kmNgMbw7kiVaUv\n7CO1vZlG5E4aKa1C4w1DPcn9w3AI8yrzV428VcqX6rgaMHIsLMCKGwN0G6Yke7aA\nGbJPgj9EXDzAfnK9ie+3oSWpjs1joFiqljPVUv9NQxeDxXFpMtIq2LR4ahcdly/M\n/7Pu/51kdEDqAUOn9UoMxMmgaAtsXmGNo+YNQQ1dja+GAgvp2fi/SUV8PaZ/G+4p\nLNdRFW2NZW/WQRWt6ydK0QKCAQEA73per7eE3HDr2Jn53A1qxgx557XWUelVZoxG\n9mTleCj1npkJWXo9BTH69+UHjrPhOJVAXJQftzH8wG9TRZcIsoYaqNgIdmlts2/o\nuEzUe6mNA3nhqaSPSf5mcgf7UEmGRa/SkCVPLOxunrZIon15hyn6goz3o1QSbT+H\nlotECPVqrwgCkvNS/kHWsG4UUT3q+PoyYBu1+5sCT2+/zaB66ARAW6pDdUyokcQR\nW+/PnrpiZCQKpaK+NkTb0yOokL7WjLiYWlD/lHetk6Conhg4go4UlBlQdPvYNe+h\nBulwBXcH4Ggu42YVMYb75FvDXPxc9E+hUFJv8C+tf0CSkMOZ1QKCAQEA+0luN3DX\njlSFLx8BqrHmMGxZXcv0sgHIk+fEdffGI3N3/rqoSqu3aS78PBhlaAANjdYlMOXc\niOjE2uAzWGRv1RTSyW+b3PEC0eNF8dVe9bFXCwWS+b6O/M6WHN6IVQzeZVm5yksP\nAx4BDXvoN5bs61NwiZmWt0wJ+QfFvmwLfQu1WfetqqVsVRrtyLISshNYyqQZ6FSK\nx9EZ2a/luqTO2HR0Bei9Hmur0RwA2yUn5snddQj11nWR6Kag+QSlEBYVnylLW3xL\nejcYfdxfgqKeaGTaJvNL4sW35DamqQ/p//NLIVxSWp+0hMFzZfd10B3gUvAN62+B\ngjncvj4kk7TrvQKCAQAiCa+ZpCkDOB2djM0hxNpvSeit0X+j5tlXmQqhDNg8yv2W\nTEQy7pfrvB3izC/VzaVuaHBceEVFwZoeM/SPCJeY4Ey7wPD6+6M3BOn8ABeXeBLt\n8o3rkdM3/ivLe2zyDXFDSGlSSatGRFi4wEn0pob2ejX8BlNQaKux0XzRHfxOlatT\nM31CK8mZD/yW2R6UKYvTVaSBWo70MyUR611EudGeVrRbEwlBi+LNzSN2gNBuzCkd\n+K12u3nztrfT+9aCtE1EdRxagfbBwHzwZb5xshmeHNm57xsrdXxWtjeaBuYAMNny\nwHwhoCnU/02gOJa9CbWgmAzioMT+S5iKZMAwSUz9AoIBAA0xmNDeYuL9OxTzStIc\njxqBxdtv5wQlpdNmOuF6xfN8j5NXV5i8FWA3cFTzbveb8Ro+YSuFFiQ2HIfld6yv\ncVO9ySd8bbGXEe/VQAnnixnZWtmgTExCnh1V93nCkWPtzguCP4gIktw2ChYcKGAq\n03uzoNgIsWokWu2xY8eQwrWpFLeJkpvAHcUGKe/8sZCaBXJ2VUnmjnbZWsMcQjKf\njqC81I6u3qcnPhk3oC/hbovmk3MeqlG9UJDnltIcVVJX5oC52VQPXaMoG2gYVwdz\n5F9U1ENxSM26VeJsoCmGRWID8zDoOQa7Fe5WfemfqZboyqtwITr4WtNsmFOAzcjX\nmf0CggEBANCwmckvsSJrVAhc3tTCDT5sKQA7lyqEx7AXpDIUA9D0NaaetL7Yh/YM\nHnADnrvNsc5/kvgaTdNk8sgzsp0J3dyPD+xBnROGyg/Jt7h7gTPzh2q6y6NRSVbB\nBnzAp2NSNbIkZm5tg8G+soU9UB50vg0sBUILBpWUX9LlZMVXzbxBo5i2omvVTP1g\nRRJzxj0itf3TSEJnBvY9KInrpI8RzfzoHrrC/V4/ftZH7yAmVyH3gw03yagoRrnZ\nagUydf7cXbP1YoOBizTgt/WBiQk47Ym4JvEWDTHmEsT4snYjujiMvAlAS37JyvWD\nosQZlO5eDVv0XR3aNy5pOR/ouC0o8a8=\n-----END PRIVATE KEY-----",
    "encrypted_pem": "-----BEGIN ENCRYPTED PRIVATE KEY-----\n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\n-----END ENCRYPTED PRIVATE KEY-----",
    "password": "supersecret"
  },
  "public_key": {
    "base64_url": "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA6xGr1bqTn_hu1PN6IdEyiytFPvQXWOHIDwnuuoMi6HWPTRe_q_TYGR5bEjml10whCTqPP62_iRVt-K5pkSAqepoXgf3R8LltVU4ESu11tYW_A4QPBqJTMHS3zx62iLiaE67XYMcxF0jTh9HnJhOCnRw7z9f4-_VRd0TrjYeptsdjHl-YqS9bym_ZTZtfGfnMFvIjfdNKFD4dtQ3G8kuAVH0rHXDq4M86GZ-3WpgEAHZSLqav1geOwJDlxoDoKwLI1ca1wJDjbe24vOzmvxyJ75Xh0Fhus9rK8L0_t3Ptwg1C6JKLuNmbprp6-qvs4_8heLURlDmoLZDGdkkeA1W0Ys99wTU_D-eB7eWAMUPHKvesoF8AF58-pzUg7EtPUtgNiy_24888zVSRk8Skp8QtTf4xv5KlJu4s696tbEEKjU-QucpQ5_-QfoGUvOFdoj_j92tsKnfzz3kC8d15mNexk3x8nws8HZtLvpUhLLvLCekoKYsQQkrgsT6LgvdJEqyNXeMncSUQj4VH46L3CqaqeMJSyx0zUd1hzJQ0l-adgxCYYXrt9qYYkauJzabO1htiBUJZNxuuu0K1tAAe5dBVq2G45EPi7us27mGTUH_vu1nNb4wztoBDb40Ehjjfbuidz-Hk7zE8oexHiAaXFFXIBo7iHDNn_q58akCJ6edjGUECAwEAAQ",
    "plain_pem": "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA6xGr1bqTn/hu1PN6IdEy\niytFPvQXWOHIDwnuuoMi6HWPTRe/q/TYGR5bEjml10whCTqPP62/iRVt+K5pkSAq\nepoXgf3R8LltVU4ESu11tYW/A4QPBqJTMHS3zx62iLiaE67XYMcxF0jTh9HnJhOC\nnRw7z9f4+/VRd0TrjYeptsdjHl+YqS9bym/ZTZtfGfnMFvIjfdNKFD4dtQ3G8kuA\nVH0rHXDq4M86GZ+3WpgEAHZSLqav1geOwJDlxoDoKwLI1ca1wJDjbe24vOzmvxyJ\n75Xh0Fhus9rK8L0/t3Ptwg1C6JKLuNmbprp6+qvs4/8heLURlDmoLZDGdkkeA1W0\nYs99wTU/D+eB7eWAMUPHKvesoF8AF58+pzUg7EtPUtgNiy/24888zVSRk8Skp8Qt\nTf4xv5KlJu4s696tbEEKjU+QucpQ5/+QfoGUvOFdoj/j92tsKnfzz3kC8d15mNex\nk3x8nws8HZtLvpUhLLvLCekoKYsQQkrgsT6LgvdJEqyNXeMncSUQj4VH46L3Cqaq\neMJSyx0zUd1hzJQ0l+adgxCYYXrt9qYYkauJzabO1htiBUJZNxuuu0K1tAAe5dBV\nq2G45EPi7us27mGTUH/vu1nNb4wztoBDb40Ehjjfbuidz+Hk7zE8oexHiAaXFFXI\nBo7iHDNn/q58akCJ6edjGUECAwEAAQ==\n-----END PUBLIC KEY-----"
  }
}
const standardScopes = "phone,email";

const isStandardScope = (scope) => {
  return STANDARD_SCOPES.includes(scope);
}

describe(`Test ${DEFAULT_PATH.ENCRYPTED_CLAIMS} path`, () => {
  test("It should respond the POST method", async () => {

    const publicKey = testKey.public_key.base64_url;
    const scopes = `${standardScopes},${TestConfig.CUSTOM_SCOPE}`;
    const testHeaders = {
      "public-key": publicKey,
      "scopes": scopes,
    }
    const body = {
      user_id: TestConfig.TEST_CREDIFY_ID,
      request_token: "whatever",
      approval_token: "whatever",
    }

    const res = await request(app).post(`${prefix}${DEFAULT_PATH.ENCRYPTED_CLAIMS}`).send(body).set(testHeaders);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("verification_info");
    expect(res.body.data.verification_info).toHaveProperty("phone.phone_number");
    expect(res.body.data.verification_info).toHaveProperty("phone.country_code");
    expect(res.body.data.verification_info).toHaveProperty("email.email");
    expect(res.body.data.verification_info).toHaveProperty("profile.family_name");
    expect(res.body.data.verification_info).toHaveProperty("profile.given_name");
    expect(res.body.data.claims).not.toBe({});
    scopes.split(",").forEach((scope) => {
      expect(res.body.data.claims).toHaveProperty(scope);
      expect(Object.keys(res.body.data.claims[scope]).length).toBeGreaterThan(1);
      if (isStandardScope(scope)) {
        expect(res.body.data.claims[scope]).toHaveProperty(`${scope}_commitment`);
      } else {
        expect(res.body.data.claims[scope]).toHaveProperty(`${scope}:commitment`);
      }
    })
  });
});
