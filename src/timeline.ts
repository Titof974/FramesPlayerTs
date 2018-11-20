import { IFrame } from './frame';

export class Timeline {
	frames: IFrame[];
	cursor: number;

	constructor(frames: IFrame[]) {
		this.frames = frames;
		this.cursor = 0;
	}

	setCursor(i: number) {
		if (i >= 0 && i < this.size()) {
			this.cursor = i;
		} else if (i > this.size()) {
			this.cursor = this.size() - 1;
		} else {
			this.cursor = 0;
		}
	}

	size(): number {
		return this.frames.length;
	}

	current(): IFrame {
		return this.frames[this.cursor];
	}

	next(): IFrame {
		if (this.cursor < this.size()-1) this.cursor++; 
		return this.current();
	}

	prev(): IFrame {
		if (this.cursor > 0) this.cursor--;
		return this.current();
	}

	atEnd(): boolean {
		return this.cursor == this.size()-1;
	}
}
