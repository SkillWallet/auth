import { FileValidator, getLengthValidator, Validator } from './validator'

// Thanks to @Sébastien.Lubineau https://medium.com/@sebastien.lubineau/input-validation-with-stenciljs-f464644545c8

export enum ValidatorsName {
    file = 'file',
    length = 'length'
}

export interface ValidatorEntry {
    name: string;
    options?: any;
}

export const defaultValidator: Validator<any> = {
    validate: (_x: any) => true
}

export function getValidator<A>(v: string | ValidatorEntry): Validator<A> {
    if (typeof v === 'string') {
        return validatorFactory(v, null);
    } else if (typeof v === 'object' && (v.name === 'length' || v.name === 'file')) {
        return validatorFactory(v.name, v.options);
    }
}

// simple controller for handling our typed validators
export function validatorFactory(name: string, options: any): Validator<any> {
    options ? options : {};
    switch (name) {
        case (ValidatorsName.file):
            return FileValidator(options);
        case (ValidatorsName.length):
            return getLengthValidator(options.min, options.max);
        default: 
            return defaultValidator;
    }
}
