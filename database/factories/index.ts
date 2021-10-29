import Factory from '@ioc:Adonis/Lucid/Factory'
import Image from 'App/Models/Image'

export const ImageFactory = Factory.define(Image, ({ faker }) => {
  return {
    src: faker.image.imageUrl(),
    alt: faker.lorem.sentence(),
  }
}).build()
