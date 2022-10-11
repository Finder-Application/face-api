import * as faceApi from '@vladmandic/face-api/dist/face-api.node';
import NP from 'number-precision';
NP.enableBoundaryChecking(false);
async function initFaceApi() {
  const modelPath = './src/models';
  console.log('======== Setting up environment and loading models ======== ');
  await Promise.all([
    faceApi.tf.setBackend('tensorflow'),
    faceApi.tf.enableProdMode(),
    faceApi.tf.ENV.set('DEBUG', false),
    faceApi.tf.ready(),
    faceApi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
    faceApi.nets.faceRecognitionNet.loadFromDisk(modelPath),
    faceApi.nets.faceLandmark68Net.loadFromDisk(modelPath),
  ]);
  console.log(
    `======== Loaded: Version: TensorFlow/JS ${
      faceApi.tf?.version_core
    } FaceAPI ${faceApi.version} Backend: ${faceApi.tf?.getBackend()} ========`,
  );
}
export default initFaceApi;
