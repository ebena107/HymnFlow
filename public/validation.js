/**
 * HymnFlow Data Validation Module
 * Ensures data integrity across import, edit, and service operations
 * 
 * Usage:
 *   const { valid, errors } = HymnValidator.validateHymn(hymnObject);
 *   const sanitized = HymnValidator.sanitizeHymn(hymnObject);
 */

const HymnValidator = {
  /**
   * Validate complete hymn object against schema
   * @param {Object} hymn - Hymn to validate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateHymn(hymn) {
    const errors = [];

    // Type check
    if (!hymn || typeof hymn !== 'object') {
      errors.push('Hymn must be an object');
      return { valid: false, errors };
    }

    // ID validation
    if (!hymn.id || typeof hymn.id !== 'string' || !hymn.id.startsWith('hymn_')) {
      errors.push('Invalid or missing hymn ID (must start with "hymn_")');
    }

    // Title validation (required)
    if (!hymn.title || typeof hymn.title !== 'string' || !hymn.title.trim()) {
      errors.push('Title is required and must be non-empty string');
    }

    // Author validation (optional but must be string)
    if (hymn.author !== undefined && typeof hymn.author !== 'string') {
      errors.push('Author must be a string');
    }

    // Verses validation (CRITICAL - must have at least one non-empty verse)
    if (!Array.isArray(hymn.verses)) {
      errors.push('Verses must be an array');
    } else if (hymn.verses.length === 0) {
      errors.push('At least one verse is required');
    } else {
      // Check each verse
      let hasValidVerse = false;
      hymn.verses.forEach((verse, idx) => {
        if (typeof verse !== 'string') {
          errors.push(`Verse ${idx + 1} is not a string`);
        } else if (!verse.trim()) {
          errors.push(`Verse ${idx + 1} is empty`);
        } else {
          hasValidVerse = true;
        }
      });
      
      if (!hasValidVerse && hymn.verses.length > 0) {
        errors.push('At least one verse must contain non-whitespace text');
      }
    }

    // Chorus validation (optional)
    if (hymn.chorus !== undefined && typeof hymn.chorus !== 'string') {
      errors.push('Chorus must be a string');
    }

    // Metadata validation (optional)
    if (hymn.metadata !== undefined) {
      if (typeof hymn.metadata !== 'object' || Array.isArray(hymn.metadata)) {
        errors.push('Metadata must be an object (not array)');
      } else if (hymn.metadata.number !== undefined) {
        if (typeof hymn.metadata.number !== 'number' || hymn.metadata.number < 0) {
          errors.push('Hymn number must be a non-negative integer');
        }
      }
    }

    // createdAt validation (optional but must be valid date if present)
    if (hymn.createdAt !== undefined && typeof hymn.createdAt === 'string') {
      if (isNaN(Date.parse(hymn.createdAt))) {
        errors.push('Invalid createdAt timestamp');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate service/setlist object
   * @param {Object} service - Service to validate
   * @param {Array} allHymns - All available hymns (for reference checking)
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validateService(service, allHymns = []) {
    const errors = [];

    if (!service || typeof service !== 'object') {
      errors.push('Service must be an object');
      return { valid: false, errors };
    }

    // ID validation
    if (!service.id || typeof service.id !== 'string') {
      errors.push('Service ID is required and must be a string');
    }

    // Name validation
    if (!service.name || typeof service.name !== 'string' || !service.name.trim()) {
      errors.push('Service name is required');
    }

    // Hymns validation
    if (!Array.isArray(service.hymns)) {
      errors.push('Service hymns must be an array of IDs');
    } else if (service.hymns.length === 0) {
      errors.push('Service must contain at least one hymn');
    } else {
      // Verify all hymn IDs exist (if reference array provided)
      if (allHymns.length > 0) {
        const validIds = new Set(allHymns.map(h => h.id));
        service.hymns.forEach((hymnId, idx) => {
          if (!validIds.has(hymnId)) {
            errors.push(`Hymn at position ${idx + 1} (ID: ${hymnId}) not found in library`);
          }
        });
      }
    }

    // Date validation (optional)
    if (service.date !== undefined && typeof service.date === 'string') {
      if (isNaN(Date.parse(service.date))) {
        errors.push('Invalid service date');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Sanitize and fix common hymn issues
   * - Trim all strings
   * - Remove empty verses
   * - Set defaults for missing optional fields
   * @param {Object} hymn - Hymn to sanitize
   * @returns {Object} Sanitized hymn
   */
  sanitizeHymn(hymn) {
    const sanitized = { ...hymn };

    // Trim all string fields
    if (sanitized.title) {
      sanitized.title = sanitized.title.trim();
    }
    if (sanitized.author) {
      sanitized.author = sanitized.author.trim();
    }
    if (sanitized.chorus) {
      sanitized.chorus = sanitized.chorus.trim();
    }

    // Clean verses: trim and remove empty ones
    if (Array.isArray(sanitized.verses)) {
      sanitized.verses = sanitized.verses
        .map(v => (typeof v === 'string' ? v : String(v)).trim())
        .filter(v => v.length > 0);
    }

    // Ensure required fields exist
    if (!sanitized.author) {
      sanitized.author = '';
    }
    if (!sanitized.chorus) {
      sanitized.chorus = '';
    }
    if (!sanitized.metadata) {
      sanitized.metadata = {};
    }
    if (!sanitized.verses) {
      sanitized.verses = [];
    }

    return sanitized;
  },

  /**
   * Batch validate hymns and return only valid ones
   * Useful for import operations
   * @param {Array} hymns - Array of hymns to validate
   * @returns {Object} { valid: Array, invalid: Array with errors }
   */
  batchValidate(hymns) {
    const valid = [];
    const invalid = [];

    (hymns || []).forEach((hymn, idx) => {
      const sanitized = this.sanitizeHymn(hymn);
      const { valid: isValid, errors } = this.validateHymn(sanitized);

      if (isValid) {
        valid.push(sanitized);
      } else {
        invalid.push({
          index: idx,
          hymn: sanitized,
          errors
        });
      }
    });

    return { valid, invalid };
  }
};

// Export for global use
if (typeof window !== 'undefined') {
  window.HymnValidator = HymnValidator;
}
