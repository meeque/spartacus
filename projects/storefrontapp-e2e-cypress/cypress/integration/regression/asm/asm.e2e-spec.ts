import * as asm from '../../../helpers/asm';
import { login } from '../../../helpers/auth-forms';
import * as checkout from '../../../helpers/checkout-flow';
import { getErrorAlert } from '../../../helpers/global-message';
import { waitForPage } from '../../../helpers/navigation';
import { getSampleUser } from '../../../sample-data/checkout-flow';
import { clearAllStorage } from '../../../support/utils/clear-all-storage';

context('Assisted Service Module', () => {
  before(() => {
    clearAllStorage();
  });

  describe('Customer Support Agent - Emulation', () => {
    asm.testCustomerEmulation();

    it('should checkout as customer', () => {
      const customer = getSampleUser();
      checkout.registerUser(false, customer);

      cy.log('--> Agent logging in');
      checkout.visitHomePage('asm=true');
      cy.get('cx-asm-main-ui').should('exist');
      cy.get('cx-asm-main-ui').should('be.visible');

      asm.agentLogin();

      cy.log('--> Starting customer emulation');
      asm.startCustomerEmulation(customer);

      cy.log('--> Add product to cart and go to checkout');
      checkout.goToCheapProductDetailsPage();
      checkout.addCheapProductToCartAndBeginCheckoutForSignedInCustomer();

      cy.log('--> Go through delivery form');
      cy.contains('Continue').click();
      checkout.fillAddressFormWithCheapProduct();

      cy.log('--> Choose delivery method');
      checkout.verifyDeliveryMethod();

      cy.log('--> Fill payment form and continue');
      checkout.fillPaymentForm();

      cy.log('--> Place order');
      checkout.placeOrderWithCheapProduct();

      cy.log('--> sign out and close ASM UI');
      asm.agentSignOut();
    });
  });

  describe('When a customer session and an asm agent session are both active', () => {
    it('Customer should not be able to login when there is an active CS agent session.', () => {
      const customer = getSampleUser();

      const loginPage = waitForPage('/login', 'getLoginPage');
      cy.visit('/login?asm=true');
      cy.wait(`@${loginPage}`);

      asm.agentLogin();
      login(customer.email, customer.password);
      getErrorAlert().should(
        'contain',
        'Cannot login as user when there is an active CS agent session. Please either emulate user or logout CS agent.'
      );
    });

    // TODO(#9445): Add e2e test for this scenario
    it.skip('agent login when user is logged in should start this user emulation', () => {});

    // TODO(#9445): Add e2e test for this scenario
    it.skip('agent logout when user was logged and emulated should restore the session', () => {});
  });
});
