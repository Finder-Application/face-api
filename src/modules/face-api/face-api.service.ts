import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import * as faceApi from '@vladmandic/face-api';
import { minus } from 'number-precision';
import { ResponseMessage } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import { Descriptor } from './dto/faceMatcher.dto';

@Injectable()
export class FaceApiService {
  constructor() {}
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

  decodeImageToTensor(content: Uint8Array) {
    const decoded = tf.node.decodeImage(content);
    const casted = decoded.toFloat();
    const result = casted.expandDims(0);
    decoded.dispose();
    casted.dispose();
    return result;
  }
  async detectImage(base64: string) {
    const unit8ArrayData = this.convertBase64ToBinary(base64);
    const tensorData = this.decodeImageToTensor(unit8ArrayData);
    const results = await faceApi
      .detectAllFaces(tensorData as unknown as faceApi.TNetInput)
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
    return {
      id: uuidv4(),
      descriptor: results[0].descriptor,
    };
  }

  async faceMatcher(descriptor1: Descriptor, descriptor2: Descriptor) {
    const { distance } = new faceApi.FaceMatcher(
      Float32Array.from(Object.values(descriptor1)),
      1,
    ).findBestMatch(Float32Array.from(Object.values(descriptor2)));
    return {
      similarity: minus(1, distance),
    };
  }
}
