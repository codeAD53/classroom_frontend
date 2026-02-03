import { CLOUDINARY_CLOUD_NAME } from '@/constants';
import { dpr, format, quality } from '@cloudinary/transformation-builder-sdk/actions/delivery';
import { name } from '@cloudinary/transformation-builder-sdk/actions/namedTransformation';
import { source } from '@cloudinary/transformation-builder-sdk/actions/overlay';
import { fill } from '@cloudinary/transformation-builder-sdk/actions/resize';
import { Position } from '@cloudinary/transformation-builder-sdk/qualifiers';
import { compass } from '@cloudinary/transformation-builder-sdk/qualifiers/gravity';
import { text } from '@cloudinary/transformation-builder-sdk/qualifiers/source';
import { TextStyle } from '@cloudinary/transformation-builder-sdk/qualifiers/textStyle';
import {Cloudinary} from '@cloudinary/url-gen'

const cld = new Cloudinary({cloud: {cloudName: CLOUDINARY_CLOUD_NAME}})
export const bannerPhoto = (imageCldPubId: string, name: string) =>{
    return cld
.image(imageCldPubId)
.resize(fill())
.delivery(format('auto'))
.delivery(quality('auto'))
.delivery(dpr('auto'))
.overlay(source(text(name, new TextStyle('roboto', 100).fontWeight('bold')).textColor('white'))).position(
    new Position()
             .gravity(compass('west'))
            .offsetX(0.02)
        //     .offsetY(0.02)
        )
    }