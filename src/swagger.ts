import { DocumentBuilder } from '@nestjs/swagger';

const configSwagger = new DocumentBuilder()
  .setTitle('API Face-api for finder')
  .setDescription('Provide api detect and compare two face')
  .setExternalDoc(
    'references',
    'https://medium.com/analytics-vidhya/implement-a-face-recognition-attendance-system-with-face-api-js-part-iii-4ed3ffc49479',
  )
  .addApiKey({
    type: 'apiKey',
  })
  .setVersion('1.0')
  .build();

export default configSwagger;
