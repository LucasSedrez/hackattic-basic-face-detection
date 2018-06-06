import { PositionsService } from "..";
import { data, emptyData, dataWithoutBoundingBoxes } from './detecetd-faces-data';

describe('positions service test', () => {

	let positionsService: PositionsService;

	beforeEach(() => {

		positionsService = new PositionsService();
	});

	it('should getBoundingBoxesPositions', () => {

		const result = [{
			x: 317.3333406448364,
			y: 99.5555579662323,
			width: 75.55555701255798,
			height: 75.55555701255798
		},
		{
			x: 18.666666746139526,
			y: 100.44444799423218,
			width: 71.11111283302307,
			height: 71.11111283302307
		},
		{
			x: 512.8889083862305,
			y: 511.11111640930176,
			width: 68.44444274902344,
			height: 68.44444274902344
		},
		{
			x: 412.44444847106934,
			y: 613.3333206176758,
			width: 66.66666865348816,
			height: 66.66666865348816
		}];

		expect(positionsService.getBoundingBoxesPositions(data)).toEqual(result);
	});

	it('should getBoundingBoxesPositions return an error as can not get the positions', () => {

		expect(() => positionsService.getBoundingBoxesPositions(emptyData)).toThrowError('Can\'t get the bounding boxes positions!');
	});

	it('should getBoundingBoxesPositions return an empty array', () => {

		expect(positionsService.getBoundingBoxesPositions(dataWithoutBoundingBoxes)).toHaveLength(0);
	});

	it('should findPositions', () => {

		const result = [[3, 1], [0, 1], [5, 5], [4, 6]];

		expect(positionsService.findPositions(data)).toEqual(result);
	});

	it('should findPositions return an empty array', () => {

		jest.spyOn(positionsService, 'getBoundingBoxesPositions').mockReturnValueOnce([null, null]).mockReturnValue(undefined);

		expect(positionsService.findPositions(dataWithoutBoundingBoxes)).toHaveLength(0);
		expect(positionsService.findPositions(dataWithoutBoundingBoxes)).toHaveLength(0);
	});
});