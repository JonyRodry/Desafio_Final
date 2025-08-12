import { render } from '@testing-library/react';
import { Challenge1 } from '..';

const buildTestableComponent = (component) => render(component);

describe('<Challenge1 />', () => {
	it('should renders screen', () => {
		const wrapper = buildTestableComponent(<Challenge1 />);
		expect(wrapper).toBeDefined();
	});
});
