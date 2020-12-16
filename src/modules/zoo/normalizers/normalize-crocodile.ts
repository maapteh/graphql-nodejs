import { Crocodile, Gender } from "@app/generated/_graphql";

export type RawCrocodile = {
    age: number;
    date_of_birth: string;
    id: number;
    name: string;
    sex: string;
}

export const normalizeCrocodile = (
    raw: RawCrocodile,
): Crocodile => {

    return {
        age: raw.age,
        birthDate: raw.date_of_birth,
        id: raw.id,
        name: raw.name,
        sex: raw.sex as Gender,
    };
};
