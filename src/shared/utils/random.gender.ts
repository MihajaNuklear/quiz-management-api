import { GENDER } from '../../user/entities/user.entity';

export default function getRandomGender(): GENDER {
    const randomIndex = Math.floor(Math.random() * 2);

    if (randomIndex === 0) {
        return GENDER.MALE;
    } else {
        return GENDER.FEMALE;
    }
}

