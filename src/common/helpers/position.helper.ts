export function centerOfSquare(coordinate: number, dimension: number) {

	return coordinate + (dimension / 2);
}

export function findPosition(value: number) {

	let position = Math.floor(value / 100);

	if (value % 100 === 0) {

		position = position - 1;
	}

	return position;
}