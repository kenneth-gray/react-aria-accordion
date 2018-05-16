import { KeyboardEvent, SyntheticEvent } from 'react';

export type EventListener = (event: SyntheticEvent<HTMLElement>) => void;
export type KeyboardEventListener = (event: KeyboardEvent<HTMLElement>) => void;
