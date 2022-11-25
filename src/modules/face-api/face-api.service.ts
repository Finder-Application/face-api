import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as faceApi from '@vladmandic/face-api';
import { ApiConfigService } from 'configs/apiConfig.service';
import { minus } from 'number-precision';
import resizeImg from 'resize-img';
import { ResponseMessage } from 'utils';
import { Descriptor } from './dto/faceMatcher.dto';

@Injectable()
export class FaceApiService {
  constructor(private apiConfig: ApiConfigService) {}

  convertBase64ToBinary(base64: string) {
    const Window = require('window');
    const BASE64_MARKER = ';base64,';
    const base64Index = base64.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const window = new Window();
    const raw = window.atob(base64.substring(base64Index));
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  async decodeImageToTensor(content: Uint8Array) {
    const decoded = tf.node.decodeImage(content);
    const casted = decoded.toFloat();
    const result = casted.expandDims(0);
    decoded.dispose();
    casted.dispose();
    return result;
  }

  // ** detect image by base64
  async detectImage(file: any) {
    const image = await resizeImg(file.buffer, {
      width: 1000,
      height: 1000,
      format: 'jpg',
    });

    const tensor = await this.decodeImageToTensor(image);
    const optionsSSDMobileNet = new faceApi.SsdMobilenetv1Options({
      minConfidence: 0.5,
    });
    const results = await faceApi
      .detectAllFaces(tensor as any, optionsSSDMobileNet)
      .withFaceLandmarks()
      .withFaceDescriptors();
    if (results.length === 0) {
      return ResponseMessage(`Can't find the face in the photo`, 'BAD_REQUEST');
    }

    if (results.length > 1) {
      return ResponseMessage(
        `Please provide image have only one face`,
        'BAD_REQUEST',
      );
    }
    return results.map((result) => result.descriptor);
  }

  async faceMatcher(descriptors: Descriptor[], descriptors2: Descriptor[]) {
    if (!descriptors.length || !descriptors2.length) {
      return {
        isMatcher: false,
        similar: 0,
      };
    }
    const convertsFloat1 = descriptors.map((descriptor) =>
      Float32Array.from(Object.values(descriptor)),
    );

    const convertsFloat2 = descriptors2.map((descriptor) =>
      Float32Array.from(Object.values(descriptor)),
    );

    let distanceTwoFaces = 1;

    const isMatcher = convertsFloat1.some((floatItem) => {
      const { distance } = new faceApi.FaceMatcher(
        convertsFloat2,
        0.6,
      ).findBestMatch(floatItem);
      distanceTwoFaces = distance;
      return minus(1, distance) > Number(this.apiConfig.get('MATCHER'));
    });

    return {
      isMatcher,
      distance: distanceTwoFaces,
      similar: minus(1, distanceTwoFaces),
    };
  }
}
