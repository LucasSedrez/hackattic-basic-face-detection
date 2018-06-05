import { HackatticService } from "../../../hackattic/hackattic.service";
import { S3Service } from "../../../aws/s3.service";
import { RekognitionService } from "../../../aws/rekognition.service";
import { PositionsService, ImageService } from "../..";
import { BasicFacade } from "..";
import { data } from '../../specs/detecetd-faces-data';

jest.mock('../../../aws/rekognition.service');
jest.mock('../../../hackattic/hackattic.service');
jest.mock('../../../aws/s3.service');
jest.mock('../../image.service');

describe('basic facade test', () => {

	let facade: BasicFacade;
	let hackattic: HackatticService;
	let imageService: ImageService;
	let s3: S3Service;
	let rekognition: RekognitionService;

	beforeEach(() => {

		hackattic = new HackatticService('ACCESS_TOKEN', true);
		s3 = new S3Service('S3_ACCESS_KEY', 'S3_SECRET_ACCESS_KEY');
		rekognition = new RekognitionService('REKOGNITION_ACCESS_KEY', 'REKOGNITION_SECRET_ACCESS_KEY');
		const positionsService = new PositionsService();
		imageService = new ImageService(positionsService, s3);

		facade = new BasicFacade(s3, rekognition, hackattic, positionsService, imageService);
	});

	it('should call detectFaces', async () => {

		const detectFaces = jest.fn(() => {
			return data;
		});

		const getImageUrl = jest.fn(() => {
			return {};
		});

		const uploadImageFromUrl = jest.fn(() => {
			return {};
		});

		jest.spyOn(hackattic, 'getImageUrl').mockImplementation(getImageUrl);
		jest.spyOn(rekognition, 'detectFaces').mockImplementation(detectFaces);
		jest.spyOn(s3, 'uploadImageFromUrl').mockImplementation(uploadImageFromUrl);

		await expect(facade.detectFaces()).resolves.toEqual(data);
		expect(getImageUrl).toBeCalled();
		expect(uploadImageFromUrl).toBeCalled();
		expect(detectFaces).toBeCalled();
	});

	it('should call solveTheProblem', async () => {

		const detectFaces = jest.fn(() => {
			return data;
		});

		const solve = jest.fn(() => {
			return {};
		});

		jest.spyOn(hackattic, 'solve').mockImplementation(solve);
		jest.spyOn(facade, 'detectFaces').mockImplementation(detectFaces);

		await expect(facade.solveTheProblem()).resolves.toEqual({});
		expect(detectFaces).toBeCalled();
		expect(solve).toBeCalled();
	});

	it('should call showMeTheFaces', async () => {

		const detectFaces = jest.fn(() => {
			return data;
		});

		const generateImage = jest.fn(() => {
			return { Body: new Buffer('') };
		});

		jest.spyOn(imageService, 'generateImage').mockImplementation(generateImage);
		jest.spyOn(facade, 'detectFaces').mockImplementation(detectFaces);

		await expect(facade.showMeTheFaces()).resolves.toMatchObject(
			{ Body: new Buffer('') }
		);
		expect(detectFaces).toBeCalled();
		expect(generateImage).toBeCalled();
	});
});