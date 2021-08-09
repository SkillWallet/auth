export interface Validator<A> {
    validate: (x: A) => boolean;
    errorMessage?: string;
}

export function FileValidator(files): Validator<any> {
    const allowedFileTypes = 'image.*';
    return {
        validate: (value: File) => {
            if (files.length === 0) {
                return false;
            } else if (files.length > 1) {
                return false;
            } else if (files[0].type.match(allowedFileTypes).length <= 0) {
                return false;
            } else {
                return true;
            }
        },
        errorMessage:
            files.length === 0 ? 'No image uploaded' : 
            files.length > 1 ? 'You can only upload one image at a time.' :
            files[0].type.match(allowedFileTypes).length <= 0 ? 'File type is not allowed.'
            : ''
    }
}

export function getLengthValidator(min: number, max: number): Validator<string> {

    return {
        validate: (value: string) => {
            if (!value || value === '') {
                return false;
            }
            if (min && max) {
                return min <= value.length && value.length <= max;
            } else if (min) {
                return min <= value.length
            } else if (max) {
                return value.length <= max;
            } else {
                return true;
            }
        },
        errorMessage: 
            min && max ? `You must enter between ${min} and ${max} characters`
            : min ? `You must enter atleast ${min} characters`
            : max ? `You must enter less than ${max} characters` : ''
    }
}