import { newSpecPage } from '@stencil/core/testing';
import { SkillwalletAuth } from './skillwallet-auth';

describe('skillwallet-auth', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SkillwalletAuth],
      html: '<skillwallet-auth></skillwallet-auth>',
    });
    expect(root).toEqualHtml(`
      <skillwallet-auth>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </skillwallet-auth>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [SkillwalletAuth],
      html: `<skillwallet-auth first="Stencil" last="'Don't call me a framework' JS"></skillwallet-auth>`,
    });
    expect(root).toEqualHtml(`
      <skillwallet-auth first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </skillwallet-auth>
    `);
  });
});
