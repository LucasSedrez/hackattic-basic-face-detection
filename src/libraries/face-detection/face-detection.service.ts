import { convertToPixels, findCoordinates } from '../../common/helpers/position.helper';

export class FaceDetectionService {

    public parseData(data: any) {

        return data.FaceDetails.map(record => {

            return {
                'top': record.BoundingBox.Top,
                'left': record.BoundingBox.Left
            }
        });
    }

    public findPositions(data: any) {

        const positions: number[][] = [];

        const dataInPixels = convertToPixels(data, 800);

        dataInPixels.forEach(record => {

            positions.push([findCoordinates(record.top), findCoordinates(record.left)]);
        });

        console.log(positions);

        return positions;
    }
}