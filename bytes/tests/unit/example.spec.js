import { mount } from '@vue/test-utils';
import HeaderNav from '@/src/components/HeaderNav.vue';

describe('HeaderNav.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(HeaderNav);
    // eslint-disable-next-line no-undef
    expect(wrapper.exists()).toBe(true);
  });
});
