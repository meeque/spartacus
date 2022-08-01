import { Pipe, PipeTransform, Renderer2 } from '@angular/core';
import { WindowRef } from '@spartacus/core';

/*
 * Supplements the anchor links that contain only the hash fragment in the `href` attribute,
 * (e.g. `<a href="#someId">`), by prepending the current location (path and query params),
 * so it becomes a link to a full url
 * e.g. `<a href="https://domain.com/current/path?and=query-params#someId">`.
 *
 * This helps to avoid the undesirable navigation to the homepage URL (`/#someId`)
 * when clicking the original link.
 *
 * It's useful for example for cms-provided content passed to the [innerHTML] directive.
 *
 * This pipe does not guarantee that the resulting html source code snippet will be safe for use.
 * That is, if the inputs to the pipe contain undesired JavaScript code, the outputs will contain undesired JavaScript code, too.
 * Do NOT bypass Angular's html sanitization when passing the results of this pipe to the browser for rendering!
 */
@Pipe({ name: 'cxSupplementHashAnchors' })
export class SupplementHashAnchorsPipe implements PipeTransform {
  constructor(protected renderer: Renderer2, protected winRef: WindowRef) {}

  protected getAbsoluteUrl(relativeUrl: string): string {
    const absoluteUrl = new URL(relativeUrl, this.winRef.location.href);
    return absoluteUrl.href;
  }

  public transform(html: string = ''): string {
    // the following code is secure, because:
    // 1. <template> element contents are inert and will not execute JS event handlers upon DOM manipulation
    // 2. the returned HTML source code snippet will be subject to standard Angular html sanitization mechanisms
    const template = this.renderer.createElement('template');
    template.innerHTML = html.trim();
    const linkNodes: NodeListOf<HTMLAnchorElement> =
      template.content.querySelectorAll('a');

    Array.from(linkNodes).forEach((link: HTMLAnchorElement) => {
      const href = link.getAttribute('href');
      if (href?.indexOf('#') === 0) {
        this.renderer.setAttribute(link, 'href', this.getAbsoluteUrl(href));
      }
    });
    return template.innerHTML;
  }
}
