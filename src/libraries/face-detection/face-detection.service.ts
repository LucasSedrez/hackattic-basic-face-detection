export class FaceDetectionService {

    public parseData(data: any) {

        return data.FaceDetails.map(record => {

            return {
                'top': record.BoundingBox.Top,
                'left': record.BoundingBox.Left
            }
        });
    }
}