import UnionBankScraper from './unionbank';
import {
  maybeTestCompanyAPI, extendAsyncTimeout, getTestsConfig, exportTransactions
} from '../../tests/tests-utils';
import { SCRAPERS } from '../definitions';
import { LOGIN_RESULT } from '../constants';

const COMPANY_ID = 'Union'; // TODO this property should be hard-coded in the provider
const testsConfig = getTestsConfig();

describe('Union bank scraper', () => {
  beforeAll(() => {
    scraper.getLoginOptions(testsConfig.credentials.union);

    extendAsyncTimeout(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });

  test('should expose login fields in scrapers constant', () => {
    //(SCRAPERS.union).getLoginOptions();
    expect(SCRAPERS.union).toBeDefined();
    expect(SCRAPERS.union.loginFields).toContain('username');
    expect(SCRAPERS.union.loginFields).toContain('password');
  });



  maybeTestCompanyAPI(COMPANY_ID, (config) => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = {
      ...testsConfig.options,
      companyId: COMPANY_ID,
    };

    const scraper = new UnionBankScraper(options);


    const result = await scraper.scrape({ username: 'e10s12', password: '3f3ss3d' });

    expect(result).toBeDefined();
    expect(result.success).toBeFalsy();
    expect(result.errorType).toBe(LOGIN_RESULT.INVALID_PASSWORD);
  });

  maybeTestCompanyAPI(COMPANY_ID)('should scrape transactions"', async () => {
    const options = {
      ...testsConfig.options,
      companyId: COMPANY_ID,
    };

    const scraper = new UnionBankScraper(options);
    // scraper.getLoginOptions(testsConfig.credentials.union);
    const result = await scraper.scrape(testsConfig.credentials.union);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();

    exportTransactions(COMPANY_ID, result.accounts || []);
  });
});
