/**
 * Performance monitoring utilities for dashboard components
 * Tracks load times and provides performance metrics
 */

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
}

class DashboardPerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  private readonly enabled: boolean

  constructor() {
    // Only enable in development or when explicitly configured
    this.enabled =
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true'
  }

  /**
   * Start tracking a performance metric
   */
  start(metricName: string): void {
    if (!this.enabled) return
    this.metrics.set(metricName, performance.now())
  }

  /**
   * End tracking and log the performance metric
   */
  end(metricName: string): PerformanceMetric | null {
    if (!this.enabled) return null

    const startTime = this.metrics.get(metricName)
    if (!startTime) {
      console.warn(`Performance metric "${metricName}" was not started`)
      return null
    }

    const endTime = performance.now()
    const duration = endTime - startTime

    const metric: PerformanceMetric = {
      name: metricName,
      duration,
      timestamp: Date.now()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Performance] ${metricName}: ${duration.toFixed(2)}ms`,
        metric
      )
    }

    // Clean up
    this.metrics.delete(metricName)

    return metric
  }

  /**
   * Measure a function execution time
   */
  async measure<T>(metricName: string, fn: () => Promise<T> | T): Promise<T> {
    this.start(metricName)
    try {
      const result = await fn()
      this.end(metricName)
      return result
    } catch (error) {
      this.end(metricName)
      throw error
    }
  }

  /**
   * Get Web Vitals metrics if available
   */
  getWebVitals(): void {
    if (!this.enabled || typeof window === 'undefined') return

    // Check if Performance Observer is available
    if ('PerformanceObserver' in window) {
      try {
        // Observe Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          console.log('[Web Vitals] LCP:', lastEntry)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // Observe First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            console.log('[Web Vitals] FID:', entry)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Observe Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            console.log('[Web Vitals] CLS:', entry)
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        console.warn('Failed to observe Web Vitals:', error)
      }
    }
  }
}

// Singleton instance
export const performanceMonitor = new DashboardPerformanceMonitor()

/**
 * React hook for measuring component render performance
 */
export function usePerformanceMonitor(componentName: string) {
  if (typeof window === 'undefined') return

  // Track component mount time
  const mountTime = performance.now()

  return {
    logRenderTime: () => {
      const renderTime = performance.now() - mountTime
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Performance] ${componentName} render: ${renderTime.toFixed(2)}ms`
        )
      }
    }
  }
}
