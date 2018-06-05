import { findCoordinates } from '../../common/helpers/position.helper';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '../../common/settings/general';
import { DetectFacesResponse } from 'aws-sdk/clients/rekognition';

export class FaceDetectionService {

	public getXY(detectFacesReponse: DetectFacesResponse) {

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
	}

	public findPositions(detectFacesReponse: DetectFacesResponse) {

		const xyPositions = this.getXY(detectFacesReponse);

		const positions: number[][] = [];

		if (xyPositions) {

			xyPositions.forEach(record => {

				if (record) {

					positions.push([findCoordinates(record.x), findCoordinates(record.y)]);
				}
			});
		}

		return positions;
	}
}