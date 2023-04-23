import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as faceApi from '@vladmandic/face-api';
import { ApiConfigService } from 'configs/apiConfig.service';
import { minus } from 'number-precision';
import resizeImg from 'resize-img';
import { ResponseMessage } from 'utils';
import { Descriptor } from './dto/faceMatcher.dto';
import canvas from 'canvas';
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

  async detect(
    data: Buffer | Uint8Array,
    options: faceApi.SsdMobilenetv1Options,
  ) {
    let img;
    if (data instanceof Buffer) {
      img = (await canvas.loadImage(data)) as unknown as faceApi.TNetInput;
    } else {
      img = await this.decodeImageToTensor(data);
    }

    const results = await faceApi
      .detectAllFaces(img, options)
      .withFaceLandmarks()
      .withFaceDescriptors();
    if (results.length === 0) {
      throw ResponseMessage(`Can't find the face in the photo`, 'BAD_REQUEST');
    }

    if (results.length > 1) {
      throw ResponseMessage(
        `Please provide image have only one face`,
        'BAD_REQUEST',
      );
    }
    return results.map((result) => result.descriptor);
  }

  // ** detect image by base64
  async detectImage(file: any) {
    console.log(
      '🚀 ~ file: face-api.service.ts:67 ~ FaceApiService ~ detectImage ~ file:',
      file,
    );
    const optionsSSDMobileNet1 = new faceApi.SsdMobilenetv1Options({
      minConfidence: 0.5,
    });

    const optionsSSDMobileNet2 = new faceApi.SsdMobilenetv1Options({
      minConfidence: 0.2,
    });
    if (typeof file == 'string') {
      const unit8Array = this.convertBase64ToBinary(file);
      const result = await Promise.any([
        this.detect(unit8Array, optionsSSDMobileNet2),
        this.detect(unit8Array, optionsSSDMobileNet1),
      ]);
      return result;
    }

    const result = await Promise.any([
      this.detect(file.buffer, optionsSSDMobileNet2),
      this.detect(file.buffer, optionsSSDMobileNet1),
    ]);
    return result;
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
