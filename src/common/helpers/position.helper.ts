export function centerCoordinate(coordinate: number, dimension: number) {

	return coordinate + (dimension / 2);
}

export function findCoordinates(value: number) {

	value = Math.floor(value / 100);

	if (value % 100) {

		value - 1;
	}

	return value;
}