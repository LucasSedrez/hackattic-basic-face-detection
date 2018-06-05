export function findCoordinates(value: number) {

	value = Math.floor(value / 100);

	if (value % 100) {

		value - 1;
	}

	return value;
}