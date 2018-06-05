import { findPosition, centerOfSquare } from '../../common/helpers/position.helper';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '../../common/settings/general';
import { DetectFacesResponse } from 'aws-sdk/clients/rekognition';

export class FaceDetectionService {

	public getBoundingBoxesPositions(detectFacesReponse: DetectFacesResponse) {

		const faces = { ...detectFacesReponse };

		if (faces && faces.FaceDetails) {

			return faces.FaceDetails.map(record => {

				if (record.BoundingBox &&
					record.BoundingBox.Left &&
					record.BoundingBox.Top &&
					record.BoundingBox.Width &&
					record.BoundingBox.Height) {

					return {
						'x': record.BoundingBox.Left * IMAGE_WIDTH,
						'y': record.BoundingBox.Top * IMAGE_HEIGHT,
						'width': record.BoundingBox.Width * IMAGE_WIDTH,
						'height': record.BoundingBox.Height * IMAGE_HEIGHT
					}
				}
			}).filter(fd => fd !== undefined);
		}

		throw new Error('Can\'t get the bounding boxes positions!');
	}

	public findPositions(detectFacesReponse: DetectFacesResponse) {

		const boundingBoxesPositions = this.getBoundingBoxesPositions(detectFacesReponse);

		const positions: number[][] = [];

		if (boundingBoxesPositions) {

			boundingBoxesPositions.forEach(boundingBox => {

				if (boundingBox) {

					positions.push([
						findPosition(centerOfSquare(boundingBox.x, boundingBox.width)),
						findPosition(centerOfSquare(boundingBox.y, boundingBox.height))
					]);
				}
			});
		}

		return positions;
	}
}