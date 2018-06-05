import { centerOfSquare, findPosition } from "../position.helper";

describe('position helper text test', () => {

	it('should find the center of the square', () => {

		expect(centerOfSquare(226, 40)).toBe(246);
		expect(centerOfSquare(733.3333492279053, 39.11111056804657)).toBe(752.8889045119286);
	});

	it('should return the matrix position based on the value', () => {

		expect(findPosition(16.88888818025589)).toBe(0);
		expect(findPosition(119.11110877990723)).toBe(1);
		expect(findPosition(226.66666507720947)).toBe(2);
		expect(findPosition(320.88890075683594)).toBe(3);
		expect(findPosition(432.0000171661377)).toBe(4);
		expect(findPosition(600)).toBe(5);
		expect(findPosition(700)).toBe(6);
		expect(findPosition(733.3333492279053)).toBe(7);
		expect(findPosition(800)).toBe(7);
	});
});